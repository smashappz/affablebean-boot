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

package com.affablebean.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.affablebean.domain.Customer;

@RunWith(SpringRunner.class)
public class CustomerRepositoryTests {
	@MockBean
	private CustomerRepository customers;

	@Before
	public void setUp() {
		Customer customer = new Customer("John Doe", "johndoe@gmail.com", "111-222-333", "Nowhere St, Planet Mars",
				"NS", "1111222233334444");

		List<Customer> customerList = new ArrayList<>();
		customerList.add(customer);

		Mockito.when(customers.findByName(customer.getName())).thenReturn(customerList);
	}

	@Test
	public void testFindByName() {
		String name = "John Doe";
		List<Customer> findByName = customers.findByName(name);
		assertThat(findByName).extracting(Customer::getName).containsOnly(name);
	}

}