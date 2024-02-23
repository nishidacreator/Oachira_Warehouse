import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-po-invoice',
  templateUrl: './po-invoice.component.html',
  styleUrls: ['./po-invoice.component.scss']
})
export class PoInvoiceComponent implements OnInit {
  invoiceNumber: string = '';
  currentDate: Date = new Date();
  customerName: string = '';
  customerEmail: string = ''; // Initialize the property here
  items: any[] = []; // Array of items with properties: name, quantity, price

  constructor() { }

  ngOnInit(): void {
    // Initialize invoice data
    this.invoiceNumber = 'INV-001';
    this.currentDate = new Date();
    this.customerName = 'John Doe';
    this.customerEmail = 'john@example.com';
    this.items = [
      { name: 'Product A', quantity: 2, price: 10 },
      { name: 'Product B', quantity: 1, price: 20 },
      { name: 'Product C', quantity: 3, price: 15 }
    ];
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }
}
