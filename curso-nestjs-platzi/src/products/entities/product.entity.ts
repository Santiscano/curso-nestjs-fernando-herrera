import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  JoinColumn,
} from 'typeorm';

import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity({ name: 'products' }) // con el name le definimos el nombre de la tabla y se usa en plural como buena práctica
@Index(['price', 'stock'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Index()
  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  @CreateDateColumn({
    name: 'create_at', // y este name es el que cambia el nombre de la columna en la tabla conservando las buenas practicas de como se debe nombrar "naming convention"
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToOne(() => Brand, (brand) => brand.products) // muchos productos de 1 marca
  @JoinColumn({ name: 'brand_id' }) // en el caso de manytoone el name se pone en este decorador
  brand: Brand;

  @ManyToMany(() => Category, (category) => category.products) // muchos productos de muchas categorias, con este decorador se establece la relacion muchos a muchos
  @JoinTable({ // con este decorador se genera la tabla intermedia para la relacion muchos a muchos
    name: 'products_categories', // este es el nombre de la tabla intermedia
    joinColumn: {
      name: 'product_id',
    },
    inverseJoinColumn: {
      name: 'category_id',
    },
  })
  categories: Category[];
}
