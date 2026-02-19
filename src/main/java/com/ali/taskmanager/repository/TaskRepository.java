package com.ali.taskmanager.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ali.taskmanager.entity.Task;


public interface TaskRepository extends JpaRepository<Task, Long> {
	

}
