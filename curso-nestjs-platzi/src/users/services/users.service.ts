import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from './../../products/services/products.service';
import { CustomersService } from './customers.service';
import { exec } from 'node:child_process';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @Inject('PG') private clientPg: Client,
    @InjectRepository(User) private userRepo: Repository<User>,
    private customersService: CustomersService,
  ) {}

  // private counterId = 1;
  // private users: User[] = [
  //   {
  //     id: 1,
  //     email: 'correo@mail.com',
  //     password: '12345',
  //     role: 'admin',
  //   },
  // ];

  // findAll() {
  //   const apiKey = this.configService.get('API_KEY');
  //   const dbName = this.configService.get('DATABASE_NAME');
  //   console.log(apiKey, dbName);
  //   return this.users;
  // }
  findAll() {
    // const apiKey = this.configService.get('API_KEY');
    // const dbName = this.configService.get('DATABASE_NAME');
    // console.log(apiKey, dbName);
    return this.userRepo.find({
      relations: ['customer'],

    });
  }

  // findOne(id: number) {
  //   const user = this.users.find((item) => item.id === id);
  //   if (!user) {
  //     throw new NotFoundException(`User #${id} not found`);
  //   }
  //   return user;
  // }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  findByEmail(email: string) {
    // return this.userModel.findOne({ email }).exec(); // asi seria con mongo
    return this.userRepo.findOne({ where: { email } });
  }

  // create(data: CreateUserDto) {
  //   this.counterId = this.counterId + 1;
  //   const newUser = {
  //     id: this.counterId,
  //     ...data,
  //   };
  //   this.users.push(newUser);
  //   return newUser;
  // }
  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data); // guarda temporalmente en memoria
    // * esta seria la forma de  encriptar pero como cree un hook en la entidad user.entity.ts no es necesario
    // const hashPassword = await bcrypt.hash(newUser.password, 10);
    // newUser.password = hashPassword;

    if (data.customerId) {
      const customer = await this.customersService.findOne(data.customerId);
      newUser.customer = customer;
    }
    return this.userRepo.save(newUser);
  }

  // update(id: number, changes: UpdateUserDto) {
  //   const user = this.findOne(id);
  //   const index = this.users.findIndex((item) => item.id === id);
  //   this.users[index] = {
  //     ...user,
  //     ...changes,
  //   };
  //   return this.users[index];
  // }
  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  // remove(id: number) {
  //   const index = this.users.findIndex((item) => item.id === id);
  //   if (index === -1) {
  //     throw new NotFoundException(`User #${id} not found`);
  //   }
  //   this.users.splice(index, 1);
  //   return true;
  // }
  remove(id: number) {
    return this.userRepo.delete(id);
  }

  // getOrderByUser(id: number): Order {
  //   const user = this.findOne(id);
  //   return {
  //     date: new Date(),
  //     user,
  //     products: this.productsService.findAll(),
  //   };
  // }
  async getOrderByUser(id: number) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }

  // esta tarea es sin orm para tener el ejemplo de uso
  getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('SELECT * FROM tasks', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }
}
