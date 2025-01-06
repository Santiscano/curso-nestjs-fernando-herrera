import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, In } from 'typeorm';

import { Product } from './../entities/product.entity';
import { Category } from './../entities/category.entity';
import { Brand } from './../entities/brand.entity';

import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  // private counterId = 1;
  // private products: Product[] = [
  //   {
  //     id: 1,
  //     name: 'Product 1',
  //     description: 'Description 1',
  //     price: 100,
  //     stock: 10,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 2,
  //     name: 'Product 2',
  //     description: 'Description 2',
  //     price: 200,
  //     stock: 20,
  //     image: 'https://via.placeholder.com/150',
  //   },
  //   {
  //     id: 3,
  //     name: 'Product 3',
  //     description: 'Description 3',
  //     price: 300,
  //     stock: 30,
  //     image: 'https://via.placeholder.com/150',
  //   },
  // ];
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  findAll(params?: FilterProductsDto) {
    // return this.products;
    if (params) {
      const where: FindOptionsWhere<Product> = {};
      const { limit, offset } = params;
      const { maxPrice, minPrice } = params;
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }
      return this.productRepo.find({
        relations: ['brand'],
        where,
        take: limit,
        skip: offset,
      });
    }
    return this.productRepo.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    // const product = this.products.find((prod) => prod.id === id);
    // if (!product) throw new NotFoundException(`Product #${id} not found`);
    // return product;

    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // *sin base de datos
    // this.counterId += 1;
    // const newProduct = {
    //   id: this.counterId,
    //   ...data,
    // };
    // this.products.push(newProduct);
    // return newProduct;

    // *opcion 1 con base de datos
    // const newProduct = new Product();
    // newProduct.image = data.image;
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.stock = data.stock;
    // newProduct.image = data.image;

    // *opcion 2 con base de datos
    const newProduct = this.productRepo.create(data); // esta linea ahorra todas las anteriores deasignacion manual
    if (data.brandId) {
      const brand = await this.brandRepo.findOne({
        where: { id: data.brandId },
      });
      newProduct.brand = brand;
    }
    if (data.categoriesIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(data.categoriesIds),
      });
      newProduct.categories = categories;
    }
    return this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    // const product = this.findOne(id);
    // if (product) {
    //   const index = this.products.findIndex((item) => item.id === id);
    //   this.products[index] = {
    //     ...product,
    //     ...payload
    //   };
    //   return this.products[index];
    // }
    // return null;

    const product = await this.productRepo.findOneBy({ id });
    if (changes.brandId) {
      const brand = await this.brandRepo.findOneBy({ id: changes.brandId });
      product.brand = brand;
    }
    if (changes.categoriesIds) {
      const categories = await this.categoryRepo.findByIds(
        changes.categoriesIds,
      );
      product.categories = categories;
    }
    this.productRepo.merge(product, changes);
    return this.productRepo.save(product);
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories'],
    });
    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );
    return this.productRepo.save(product);
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['categories'],
    });
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    product.categories.push(category);
    return this.productRepo.save(product);
  }

  remove(id: number) {
    // const index = this.products.findIndex((item) => item.id === id);
    // if (index === -1) throw new NotFoundException(`Product #${id} not found`);
    // this.products.splice(index, 1);
    // return true;
    return this.productRepo.delete(id);
  }
}
