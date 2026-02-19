package com.ali.taskmanager.web;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ali.taskmanager.entity.Task;
import com.ali.taskmanager.exception.NotFoundException;
import com.ali.taskmanager.repository.TaskRepository;

@RestController
@RequestMapping("/api/tasks")

public class TaskController {
	private final TaskRepository repo;
	
	
	public TaskController(TaskRepository repo) {
		this.repo = repo;
	}
	//new Task
	@PostMapping
	public ResponseEntity<Task> create(@RequestBody Task task){
		Task saved = repo.save(task);
		return ResponseEntity.created(URI.create("/api/tasks/" + saved.getId())).body(saved);
	}
	@GetMapping
	public List<Task> getAll(){
		return repo.findAll();
	}
	//retrievment
	@GetMapping("/{id}")
	public Task getById(@PathVariable Long id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Task not found: " + id));		
	}
	
	
	//Update tasks already exist
	@PutMapping("/{id}")
	public Task update(@PathVariable Long id, @RequestBody Task updated) {
		Task existing = repo.findById(id).orElseThrow(() -> new NotFoundException("Task not found: " + id));
		existing.setTaskName(updated.getTaskName());
		existing.setDescription(updated.getDescription());
		existing.setAssignedUser(updated.getAssignedUser());
		existing.setDueDate(updated.getDueDate());
		existing.setPriority(updated.getPriority());
		existing.setStatus(updated.getStatus());
		
		
		
		return repo.save(existing);
				
				
	}
	//to delete a task
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id){
		if(!repo.existsById(id)) {
			throw new NotFoundException("Task not found: "+ id);
		}
		repo.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
}
