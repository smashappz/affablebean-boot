/*
 * Copyright 2002-2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.affablebean.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import com.affablebean.cart.ShoppingCart;
import com.affablebean.domain.Category;
import com.affablebean.domain.Product;
import com.affablebean.form.CheckoutForm;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
public class OrderManagerTests {
	@Autowired
	private TestEntityManager entityManager;

	@TestConfiguration
	static class OrderManagerTestContextConfiguration {

		@Bean
		public OrderManager orderManager() {
			return new OrderManager();
		}
	}

	@Autowired
	private OrderManager orderManager;

	@Test
	public void testFindByName() {
		Category category = new Category("Frozen foods");
		entityManager.persist(category);

		Product product = new Product();

		product.setCategory(category);
		product.setDescription("Frozen chicken 2kg");
		product.setName("Frozen chicken");
		product.setPrice(new BigDecimal(5));

		entityManager.persist(product);
		ShoppingCart sc = new ShoppingCart();

		sc.addItem(product);
		sc.update(product, Short.valueOf("2"));

		CheckoutForm form = new CheckoutForm();

		form.setAddress("123 nowhere st");
		form.setCityRegion("NY");
		form.setCreditCard("1111111122222222");
		form.setEmail("joe.bloggs@gmail.com");
		form.setName("joe bloggs");
		form.setPhone("12345678");

		orderManager.placeOrder(sc, "1.50", form);
	}

}