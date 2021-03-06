import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './enums/tasks-status.enum';
import { User } from '../auth/user.entity';
import { TaskPriority } from './enums/task-priority.enum';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });

    if (!found) {
      this.logger.error(
        `User ${user.username} tried to fetch non-existant task ${id}`,
      );
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    try {
      await task.save();
      return task;
    } catch (error) {
      this.logger.error(
        `Problem updating task status. Task ID: ${id}, User: ${user.username}, Status: ${status}`,
        error.stack
      );
    }
  }

  async updateTaskDescription(
    id: number,
    description: string,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.description = description;
    try {
      await task.save();
      return task;
    } catch (error) {
      this.logger.error(
        `Problem updating task description. Task ID: ${id}, User: ${user.username}, description: ${status}`,
        error.stack
      );
    }
  }

  async updateTaskTitle(
    id: number,
    title: string,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.title = title;
    try {
      await task.save();
      return task;
    } catch (error) {
      this.logger.error(
        `Problem updating task title. Task ID: ${id}, User: ${user.username}, title: ${status}`,
        error.stack
      );
    }
  }

  async updateTaskPriority(
    id: number,
    priority: TaskPriority,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.priority = priority;
    try {
      await task.save();
      return task;
    } catch (error) {
      this.logger.error(
        `Problem updating task priority. Task ID: ${id}, User: ${user.username}, Priority: ${priority}`,
        error.stack
      );
    }
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
  }
}
