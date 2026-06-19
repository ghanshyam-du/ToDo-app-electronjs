import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>
    ) { }

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        const todo = this.todoRepository.create(createTodoDto);
        return await this.todoRepository.save(todo);
    }

    async findAll(): Promise<Todo[]> {
        return await this.todoRepository.find();
    }

    async findOne(id: number): Promise<Todo> {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }
        return todo;
    }

    async update(id: number, updateAttrs: Partial<CreateTodoDto>): Promise<Todo> {
        const todo = await this.findOne(id);
        Object.assign(todo, updateAttrs);
        return await this.todoRepository.save(todo);
    }

    async remove(id: number): Promise<void> {
        const todo = await this.findOne(id);
        await this.todoRepository.remove(todo);
    }

    async markDone(id: number): Promise<Todo> {
        const todo = await this.findOne(id);
        todo.completed = true;
        return await this.todoRepository.save(todo);
    }
}
