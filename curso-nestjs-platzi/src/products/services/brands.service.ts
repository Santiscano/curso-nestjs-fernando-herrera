import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  // private counterId = 1;
  // private brands: Brand[] = [
  //   {
  //     id: 1,
  //     name: 'Brand 1',
  //     image: 'https://i.imgur.com/U4iGx1j.jpeg',
  //   },
  // ];
  constructor(@InjectRepository(Brand) private brandsRepo: Repository<Brand>) {}

  findAll() {
    // return this.brands;
    return this.brandsRepo.find();
  }

  findOne(id: number) {
    // const product = this.brands.find((item) => item.id === id);
    // if (!product) {
    //   throw new NotFoundException(`Brand #${id} not found`);
    // }
    // return product;
    const product = this.brandsRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  create(data: CreateBrandDto) {
    // this.counterId = this.counterId + 1;
    // const newBrand = {
    //   id: this.counterId,
    //   ...data,
    // };
    // this.brands.push(newBrand);
    // return newBrand;
    const newBrand = this.brandsRepo.create(data);
    return this.brandsRepo.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    // const brand = this.findOne(id);
    // const index = this.brands.findIndex((item) => item.id === id);
    // this.brands[index] = {
    //   ...brand,
    //   ...changes,
    // };
    // return this.brands[index];
    const brand = await this.findOne(id);
    this.brandsRepo.merge(brand, changes);
    return this.brandsRepo.save(brand);
  }

  remove(id: number) {
    // const index = this.brands.findIndex((item) => item.id === id);
    // if (index === -1) {
    //   throw new NotFoundException(`Brand #${id} not found`);
    // }
    // this.brands.splice(index, 1);
    // return true;
    return this.brandsRepo.delete(id);
  }
}
