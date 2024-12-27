import { Component, OnInit } from '@angular/core';
import { FormArray, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Task {
  id: number;
  title: string;
  description: string;
  isMarked: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  addTaskInputVisible: boolean = false;
  tasks: Task[] = [];
  newTask: { title: string; description: string } = {
    title: '',
    description: '',
  };
  form!: FormGroup;
  isEditModalVisible: boolean = false;
  editTaskForm!: FormGroup;
  editTaskIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      checkboxes: this.fb.array([]),
    });

    this.editTaskForm = this.fb.group({
      title: '',
      description: '',
    });
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.id) {
      alert('No user signed in');
      this.router.navigate(['/sign-in']);
    } else {
      this.user = currentUser;
      this.user.tasks = this.user.tasks || [];
      this.form = this.fb.group({
        checkboxes: this.fb.array([]),
      });

      this.loadTasks();

      this.checkboxes.valueChanges.subscribe(() => {
        this.saveTasks();
      });
    }
  }

  get checkboxes(): FormArray {
    return this.form.get('checkboxes') as FormArray;
  }

  loadTasks() {
    const savedTasks = JSON.parse(
      localStorage.getItem(`tasks_${this.user.id}`) || '[]'
    );
    this.tasks = savedTasks;
    this.tasks.forEach((task: Task) => {
      this.checkboxes.push(this.createTaskFormGroup(task));
    });
  }

  saveTasks() {
    this.tasks = this.checkboxes.value;
    localStorage.setItem(`tasks_${this.user.id}`, JSON.stringify(this.tasks));
  }

  showInput(): void {
    this.addTaskInputVisible = true;
  }

  hideInput(): void {
    this.addTaskInputVisible = false;
  }

  addTask() {
    if (this.newTask.title.trim() && this.newTask.description.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: this.newTask.title,
        description: this.newTask.description,
        isMarked: false,
      };
      this.checkboxes.push(this.createTaskFormGroup(newTask));
      this.tasks.push(newTask);
      this.saveTasks();
      this.newTask = { title: '', description: '' };
      this.addTaskInputVisible = false;
    }
  }

  createTaskFormGroup(task: Task): FormGroup {
    return this.fb.group({
      id: task.id,
      title: task.title,
      description: task.description,
      isMarked: task.isMarked || false,
    });
  }

  toggleMarked(index: number): void {
    const taskFormGroup = this.checkboxes.at(index) as FormGroup;
    const currentValue = taskFormGroup.get('isMarked')?.value;
    taskFormGroup.patchValue({ isMarked: !currentValue });
    this.saveTasks();
  }

  get taskSummary() {
    const totalTasks = this.checkboxes?.length || 0;
    const markedTasks =
      this.checkboxes?.controls?.filter(
        (taskControl) => taskControl.get('isMarked')?.value
      ).length || 0;
    return { totalTasks, markedTasks };
  }

  deleteTask(index: number): void {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      this.checkboxes.removeAt(index);
      this.saveTasks();
    }
  }

  openEditModal(index: number): void {
    this.editTaskIndex = index;
    const taskFormGroup = this.checkboxes.at(index) as FormGroup;
    if (taskFormGroup) {
      this.editTaskForm.patchValue({
        title: taskFormGroup.get('title')?.value,
        description: taskFormGroup.get('description')?.value,
      });
      this.isEditModalVisible = true;
    } else {
      console.error('Task form group not found at index:', index);
    }
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
  }

  saveEditedTask(): void {
    if (this.editTaskIndex !== null) {
      const taskFormGroup = this.checkboxes.at(this.editTaskIndex) as FormGroup;
      taskFormGroup.patchValue({
        title: this.editTaskForm.get('title')?.value,
        description: this.editTaskForm.get('description')?.value,
      });
      this.saveTasks();
      this.closeEditModal();
    }
  }
}
