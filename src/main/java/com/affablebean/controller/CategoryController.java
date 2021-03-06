package com.affablebean.controller;

import com.affablebean.assembler.CategoryResourceAssembler;
import com.affablebean.assembler.ProductResourceAssembler;
import com.affablebean.domain.Category;
import com.affablebean.domain.Product;
import com.affablebean.exception.CategoryNotFoundException;
import com.affablebean.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
public class CategoryController {

	@Autowired
	private CategoryRepository repository;

	@Autowired
	private CategoryResourceAssembler assembler;

	@Autowired
	private ProductResourceAssembler productAssembler;

	@GetMapping("/categories")
	public Resources<Resource<Category>> all() {
		List<Resource<Category>> categories = repository.findAllOrderByName(Sort.by("name")).stream()
				.map(assembler::toResource).collect(Collectors.toList());

		return new Resources<>(categories, linkTo(methodOn(CategoryController.class).all()).withSelfRel());
	}

	@PostMapping("/categories")
	public ResponseEntity<?> newCategory(@RequestBody Category newCategory) throws URISyntaxException {

		Resource<Category> resource = assembler.toResource(repository.save(newCategory));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@GetMapping("/categories/{id}")
	public Resource<Category> one(@PathVariable Short id) {

		Category category = repository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
		return assembler.toResource(category);
	}

	@PatchMapping("/categories/{id}")
	public ResponseEntity<?> replaceCategory(@RequestBody Category newCategory, @PathVariable Short id)
			throws URISyntaxException {

		Category updatedCategory = repository.findById(id).map(category -> {
			category.setName(newCategory.getName());
			return repository.save(category);

		}).orElseGet(() -> {
			newCategory.setId(id);
			return repository.save(newCategory);
		});

		Resource<Category> resource = assembler.toResource(updatedCategory);
		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@DeleteMapping("/categories/{id}")
	public ResponseEntity<?> deleteCategory(@PathVariable Short id) {

		repository.deleteById(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/category/{id}")
	public Resource<Object> categoryProducts(@PathVariable Short id) {
		List<Resource<Category>> categories = repository.findAllOrderByName(Sort.by("name")).stream()
				.map(assembler::toResource).collect(Collectors.toList());
		Map<String, Object> payload = new HashMap<>();

		payload.put("categories", categories);

		if (id != null) {
			Optional<Category> selectedCategory = repository.findById(id);

			if (selectedCategory.isPresent()) {
				Category category = selectedCategory.get();
				payload.put("category", assembler.toResource(category));

				List<Resource<Product>> products = category.getProductCollection().stream()
						.map(productAssembler::toResource).collect(Collectors.toList());

				payload.put("products", new Resources<>(products,
						linkTo(methodOn(ProductController.class).all()).withRel("categoryProducts")));
			}
		}

		return new Resource<>(payload, linkTo(methodOn(CategoryController.class).categoryProducts(id)).withSelfRel(),
				linkTo(methodOn(CategoryController.class).all()).withRel("categories"));
	}

}
