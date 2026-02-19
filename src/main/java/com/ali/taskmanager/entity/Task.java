package com.ali.taskmanager.entity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
@Entity
@Table(name ="tasks")
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; 
	
	@Column(nullable = false)
	private String taskName;
	
	@Column(length = 1000)
	private String description;
	private String assignedUser;
	private LocalDate dueDate;
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Priority priority = Priority.MEDIUM;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status = Status.TODO;
	
	
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdDate;
	
	@PrePersist
	void onCreate() {
		this.createdDate = LocalDateTime.now();
	}
	
	
	//ID
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
	//Task Name
	public String getTaskName() {
		return taskName;
	}
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	
	
	//Description
	public String getDescription() { 
		return description; 
	 }
	 
	public void setDescription(String description) {
		this.description = description;
	}
	
	
	//User info
	public String getAssignedUser() {
		return assignedUser;
	}
	public void setAssignedUser(String assignedUser) {
		this.assignedUser= assignedUser;
	}
	
	
	//due Dates
	public LocalDate getDueDate() {
		return dueDate;
	}
	public void setDueDate(LocalDate dueDate) {
		this.dueDate= dueDate;
	}
	
	
	//Priority
	public Priority getPriority() {
		return priority;
	}
	public void setPriority(Priority priority) {
		this.priority = priority;
	}
	
	
	//Status of progress
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	
	public LocalDateTime getCreatedDate() {
		return createdDate;
	}
	
	
	
}