import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Res,
  UseGuards,
  // ParseIntPipe,
} from '@nestjs/common';
// import { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dtos';
import { ProductsService } from './../services/products.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

// @UseGuards(AuthGuard('jwt')) // se le indica que tiene que pasar por el guardian jwt
@UseGuards(JwtAuthGuard) // tiene que pasar por el guardian personalizado que internamente tiene el guardian jwt
@ApiTags('products') // tag para documentar en swagger
@Controller('products') // endpoint de la api
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public() // le asigna a los metadatos de la funcion la propiedad isPublic con el valor true
  @Get()
  @ApiOperation({ summary: 'List of products' }) // documentacion de swagger para el endpoint get products con summary y description opcional en el objeto de configuracion del decorador @ApiOperation de nestjs swagger module.
  getProducts(
    @Query() params: FilterProductsDto // asi se recibe un objeto con todos los parametros
    // @Query('limit') limit = 100, // esta es una forma de asignar a cada variable
    // @Query('offset') offset = 0,
    // @Query('brand') brand: string,
  ) {
    // return {
    //   message: `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
    // };
    return this.productsService.findAll(params);
  }

  @Get('filter')
  getProductFilter() {
    return `yo soy un filter`;
  }

  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(
    // @Res() response: Response, // esto daria la responsabilidad de usar express pero tambien se puede perder el control del response
    @Param('productId', ParseIntPipe) productId: number
  ) {
    // response.status(200).send({
    //   message: `product ${productId}`,
    // });
    return this.productsService.findOne(productId);
  }

  @Roles(Role.ADMIN) // asigna el rol a la metadata de la funcion
  @Post()
  create(@Body() payload: CreateProductDto) {
    // return {
    //   message: 'accion de crear',
    //   payload,
    // };
    return this.productsService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productsService.update(id, payload);
  }

  @Put(':id/category/:categoryId')
  addCategoryToProduct(
    @Param('id') id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.addCategoryToProduct(id, categoryId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Delete(':id/category/:categoryId')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.removeCategoryByProduct(id, categoryId);
  }
}
