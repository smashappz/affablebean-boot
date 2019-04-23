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

import com.affablebean.domain.MsgFeedback;
import com.affablebean.domain.MsgSubject;

@RunWith(SpringRunner.class)
public class MsgFeedbackRepositoryTests {
	@MockBean
	private MsgFeedbackRepository feedbacks;

	@Before
	public void setUp() {
		MsgSubject subject = new MsgSubject();
		subject.setName("Website");

		MsgFeedback feedback = new MsgFeedback("joe bloggs", "joe.bloggs@gmail.com", "you suck!");
		feedback.setSubject(subject);
		
		List<MsgFeedback> feedbackList = new ArrayList<>();
		feedbackList.add(feedback);

		Mockito.when(feedbacks.findByName(feedback.getName())).thenReturn(feedbackList);
	}

	@Test
	public void testFindByName() {
		String name = "joe bloggs";
		List<MsgFeedback> findByName = feedbacks.findByName(name);
		assertThat(findByName).extracting(MsgFeedback::getName).containsOnly(name);
	}

}