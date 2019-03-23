package com.affablebean.forms;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.affablebean.domain.MsgSubject;

public class ContactForm {

	@NotNull
	private MsgSubject subjectId;

	@NotNull
	@Email
	@Size(min = 1, max = 45)
	private String email;

	@NotNull
	@Size(min = 1, max = 1000)
	private String msg;

	@NotNull
	@Size(min = 1, max = 45)
	private String name;

	public MsgSubject getSubjectId() {
		return subjectId;
	}

	public void setSubjectId(MsgSubject subjectId) {
		this.subjectId = subjectId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "ContactForm [subjectId=" + subjectId + ", email=" + email + ", msg=" + msg + ", name=" + name + "]";
	}

}
