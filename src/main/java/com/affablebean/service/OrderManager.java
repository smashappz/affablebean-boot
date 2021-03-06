package com.affablebean.service;

import com.affablebean.cart.ShoppingCart;
import com.affablebean.domain.Customer;
import com.affablebean.domain.CustomerOrder;
import com.affablebean.domain.OrderedProduct;
import com.affablebean.domain.OrderedProductPK;
import com.affablebean.domain.Product;
import com.affablebean.form.CheckoutForm;
import com.affablebean.repository.CustomerOrderRepository;
import com.affablebean.repository.CustomerRepository;
import com.affablebean.repository.OrderedProductRepository;
import com.affablebean.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderManager {

	@Resource
	private CustomerRepository customerRepository;

	@Resource
	private CustomerOrderRepository customerOrderRepository;

	@Resource
	private OrderedProductRepository orderedProductRepository;

	@Resource
	private ProductRepository productRepository;

	private static final Random random = new Random();

	@Transactional
	public int placeOrder(ShoppingCart cart, String surcharge, CheckoutForm checkoutForm) {

		Customer customer = addCustomer(checkoutForm);
		CustomerOrder order = addOrder(customer, cart, surcharge);

		addOrderedItems(order, cart);
		return order.getId();
	}

	public Map<String, Object> getOrderDetails(int orderId) {
		// get order
		Optional<CustomerOrder> order = customerOrderRepository.findById(orderId);

		if (!order.isPresent()) {
			return Collections.emptyMap();
		}

		// get customer
		CustomerOrder customerOrder = order.get();
		Customer customer = customerOrder.getCustomer();

		// get all ordered products
		List<OrderedProduct> orderedProducts = orderedProductRepository.findByOrderId(orderId);

		// get product details for ordered items
		List<Product> products = new ArrayList<>();

		orderedProducts.forEach(op -> {
			Optional<Product> p = productRepository.findById(op.getOrderedProductPK().getProductId());

			if (p.isPresent()) {
				products.add(p.get());
			}
		});

		// add each item to orderMap
		Map<String, Object> orderMap = new HashMap<>();

		orderMap.put("orderRecord", customerOrder);
		orderMap.put("customer", customer);
		orderMap.put("orderedProducts", orderedProducts);
		orderMap.put("products", products);

		return orderMap;
	}

	private Customer addCustomer(CheckoutForm checkoutForm) {

		Customer customer = new Customer();

		customer.setName(checkoutForm.getName());
		customer.setEmail(checkoutForm.getEmail());
		customer.setPhone(checkoutForm.getPhone());
		customer.setAddress(checkoutForm.getAddress());
		customer.setCityRegion(checkoutForm.getCityRegion());
		customer.setCcNumber(checkoutForm.getCreditCard());

		customerRepository.save(customer);
		return customer;
	}

	private CustomerOrder addOrder(Customer customer, ShoppingCart cart, String surcharge) {
		// set up customer order
		CustomerOrder order = new CustomerOrder();

		order.setCustomer(customer);
		order.setAmount(BigDecimal.valueOf(cart.getSubtotal() + Double.parseDouble(surcharge)));

		// create confirmation number
		int i = random.nextInt(999999999);
		order.setConfirmationNumber(i);

		customerOrderRepository.save(order);
		return order;
	}

	private void addOrderedItems(CustomerOrder order, ShoppingCart cart) {
		// iterate through shopping cart and create OrderedProducts
		int orderId = order.getId();

		cart.getItems().forEach(item -> {
			int productId = item.getProduct().getId();

			// set up primary key object
			OrderedProductPK orderedProductPK = new OrderedProductPK();
			orderedProductPK.setCustomerOrderId(orderId);
			orderedProductPK.setProductId(productId);

			// create ordered item using PK object
			OrderedProduct orderedItem = new OrderedProduct(orderedProductPK);

			// set quantity
			orderedItem.setQuantity(item.getQuantity());
			orderedProductRepository.save(orderedItem);
		});
	}
}
