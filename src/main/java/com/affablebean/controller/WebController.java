package com.affablebean.controller;

import java.util.Optional;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.affablebean.cart.ShoppingCart;
import com.affablebean.domain.Category;
import com.affablebean.domain.MsgFeedback;
import com.affablebean.domain.MsgSubject;
import com.affablebean.domain.Product;
import com.affablebean.form.CheckoutForm;
import com.affablebean.form.ContactForm;
import com.affablebean.repository.CategoryRepository;
import com.affablebean.repository.MsgFeedbackRepository;
import com.affablebean.repository.MsgSubjectRepository;
import com.affablebean.repository.ProductRepository;
import com.affablebean.repository.PromotionRepository;

@Controller
@SessionAttributes("cart")
public class WebController implements WebMvcConfigurer {

	@Value("${categoryImagePath:img/categories}")
	private String imgPath;

	@Value("${productImagePath:img/products}")
	private String prodPath;

	@Resource
	private CategoryRepository categoryRepository;

	@Resource
	private MsgFeedbackRepository msgFeedbackRepository;

	@Resource
	private MsgSubjectRepository msgSubjectRepository;

	@Resource
	private ProductRepository productRepository;

	@Resource
	private PromotionRepository promotionRepository;

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/login").setViewName("login");
	}

	@PostMapping({ "/addToCart" })
	public String addToCart(@ModelAttribute("cart") ShoppingCart cart,
			@RequestParam(name = "id", required = true) Integer id) {

		addToShoppingCart(cart, id);
		return "redirect:/category";
	}

	@GetMapping({ "/category" })
	public String category(Model model, @RequestParam(name = "id", required = true, defaultValue = "1") Short id) {
		model.addAttribute("categories", categoryRepository.findAllOrderByName(Sort.by("name")));
		model.addAttribute("catProms", promotionRepository.findCategories());
		model.addAttribute("prodPath", prodPath);
		model.addAttribute("prodProms", promotionRepository.findProducts());
		model.addAttribute("sale", promotionRepository.findSale(true));

		getCategoryProducts(model, id);
		return "category";
	}

	@GetMapping({ "/checkout" })
	public String checkout(CheckoutForm checkoutForm) {
		return "checkout";
	}

	@GetMapping({ "/contact" })
	public String contact(ContactForm contactForm, Model model) {
		model.addAttribute("subjects", msgSubjectRepository.findAllOrderByName(Sort.by("name")));
		return "contact";
	}

	@PostMapping({ "/feedback" })
	public String feedback(@Valid ContactForm contactForm, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return "contact";
		}

		return saveFeedback(contactForm);
	}

	@GetMapping({ "/", "/index" })
	public String index(Model model) {
		model.addAttribute("categories", categoryRepository.findAllOrderByName(Sort.by("name")));
		model.addAttribute("imgPath", imgPath);
		return "index";
	}

	@GetMapping({ "/privacy" })
	public String privacy() {
		return "privacy";
	}
	
	@PostMapping({ "/purchase" })
	public String purchase(@ModelAttribute("cart") ShoppingCart cart, @Valid CheckoutForm checkoutForm,
			BindingResult bindingResult) {

		if (bindingResult.hasErrors()) {
			return "checkout";
		}

		return purchase(cart, checkoutForm) ? "redirect:/confirmation" : "checkout";
	}

	@PostMapping({ "/updateCart" })
	public String updateCart(@ModelAttribute("cart") ShoppingCart cart,
			@RequestParam(name = "id", required = true) Integer id) {
//		updateCart(cart, id);
		return "redirect:/cart";
	}

	@GetMapping({ "/viewCart" })
	public String viewCart(@ModelAttribute("cart") ShoppingCart cart, Model model,
			@RequestParam(name = "clear", required = true) Boolean clear) {

		checkCart(cart, clear);
		return "cart";
	}

	@ModelAttribute("cart")
	public ShoppingCart getCart() {
		return new ShoppingCart();
	}

	private void addToShoppingCart(ShoppingCart cart, Integer productId) {
		if (productId != null) {
			Optional<Product> product = productRepository.findById(productId);

			if (product.isPresent()) {
				cart.addItem(product.get());
			}
		}
	}

	private void checkCart(ShoppingCart cart, Boolean clear) {
		if (clear != null && clear) {
			cart.clear();
		}
	}

	private void getCategoryProducts(Model model, Short categoryId) {
		if (categoryId != null) {
			Optional<Category> selectedCategory = categoryRepository.findById(categoryId);

			if (selectedCategory.isPresent()) {
				Category category = selectedCategory.get();
				model.addAttribute("selectedCategory", category);
				model.addAttribute("categoryProducts", category.getProductCollection());
			}
		}
	}

	private boolean purchase(ShoppingCart cart, CheckoutForm checkoutForm) {
		if (cart == null) {
			return false;
		}

		return true;
//		// see method call for order element types
//		int orderId = orderManager.placeOrder(cart, surcharge, order[0], order[1],
//						order[2], order[3], order[4], order[5]);
//
//		// if order processed successfully send user to confirmation page
//		if (orderId != 0) {
//			// in case language was set using toggle, get language choice before 
//			// destroying session
//			Locale locale = (Locale) session.getAttribute(
//							"javax.servlet.jsp.jstl.fmt.locale.session");
//			String language = "";
//
//			if (locale != null) {
//				language = (String) locale.getLanguage();
//			}
//
//			// dissociate shopping cart from session
//			cart = null;
//
//			// end session
//			session.invalidate();
//
//			// if user changed language using the toggle, reset the language attribute 
//			// otherwise language will be switched on confirmation page!			
//			if (!language.isEmpty()) {
//				request.setAttribute("language", language);
//			}
//
//			// get order details
//			Map<String, Object> orderMap = orderManager.getOrderDetails(orderId);
//
//			// place order details in request scope
//			request.setAttribute("customer", orderMap.get("customer"));
//			request.setAttribute("products", orderMap.get("products"));
//			request.setAttribute("orderRecord", orderMap.get("orderRecord"));
//			request.setAttribute("orderedProducts", orderMap.get("orderedProducts"));
//
//			return true;
//
//			// otherwise, send back to checkout page and display error
//		} else {
//			request.setAttribute("orderFailureFlag", true);
//			return false;
//		}

	}

	private String saveFeedback(ContactForm contactForm) {
		MsgFeedback feedback = new MsgFeedback(contactForm.getName(), contactForm.getEmail(), contactForm.getMsg());
		Optional<MsgSubject> subject = msgSubjectRepository.findById(contactForm.getSubjectId());

		if (subject.isPresent()) {
			feedback.setSubject(subject.get());
			MsgFeedback msgFeedback = msgFeedbackRepository.save(feedback);
			return (msgFeedback == null) ? "contact" : "redirect:/index";

		} else {
			return "contact";
		}
	}

	private void updateCart(ShoppingCart cart, Integer productId, Short quantity) {
		Optional<Product> product = productRepository.findById(productId);

		if (product.isPresent()) {
			cart.update(product.get(), quantity);
		}
	}

}
