import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  template: `
    <div class="container">
      <h2>Produtos</h2>
      
      <form [formGroup]="productForm" (ngSubmit)="addProduct()">
        <input formControlName="title" placeholder="Título">
        <input formControlName="price" placeholder="Preço">
        <button type="submit" [disabled]="productForm.invalid">Adicionar</button>
      </form>

      <div *ngFor="let product of products" class="product-card">
        {{ product.title }} - R$ {{ product.price }}
        <button (click)="deleteProduct(product.id)">Deletar</button>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  productForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe(
      data => this.products = data.products
    );
  }

  addProduct() {
    if (this.productForm.valid) {
      this.apiService.createProduct(this.productForm.value)
        .subscribe(newProduct => {
          this.products.push(newProduct);
          this.productForm.reset();
        });
    }
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id)
      .subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      });
  }
}