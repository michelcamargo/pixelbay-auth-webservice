import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '@michelcamargo/website-shared';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(
    customerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    const customer = this.customerRepository.create(customerDto);
    return this.customerRepository.save(customer);
  }

  async getByUserId(userId: string): Promise<CustomerEntity> {
    return this.customerRepository.findOneBy({ userId: userId });
  }
}
