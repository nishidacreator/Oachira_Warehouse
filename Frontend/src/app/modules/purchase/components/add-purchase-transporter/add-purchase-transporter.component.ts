import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Transporter } from '../../models/transporter';
import { TransporterComponent } from '../transporter/transporter.component';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseService } from '../../purchase.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-purchase-transporter',
  templateUrl: './add-purchase-transporter.component.html',
  styleUrls: ['./add-purchase-transporter.component.scss']
})
export class AddPurchaseTransporterComponent implements OnInit {

  constructor(private fb: FormBuilder, private dialog: MatDialog, private purchaseService: PurchaseService, private _snackBar: MatSnackBar, private route:ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.generateTransInvoiceNumber();
    this.getTransporter();
    
  }

  isHovered = false;
  hoveredButton: string | null = null;
  showName(buttonName: string){
    this.isHovered = true;
    this.hoveredButton = buttonName;
  }

  hideName() {
    this.isHovered = false;
    this.hoveredButton = null;
  }

  purchaseTransportForm = this.fb.group({
    chequeNo: [''],
    transporterId : [0, Validators.required],
    invoiceNo: ['', Validators.required],
    amount : [0],
    date: [''],
    vehicleNo: [''],
    from: [''],
    noOfBags: [0],
    advance: [0],
    entryId: [0],
    chequeClearenceDate:['']
  });

  transporter: Transporter[] = [];
  transportSub!: Subscription;
  getTransporter(value?: number){
    this.transportSub = this.purchaseService.getTransporters().subscribe(res=>{
      this.transporter = res;
      this.filteredTransporter = res;
      if(value){
        this.purchaseTransportForm.get('transporterId')?.setValue(value)
      }
    })
  }

  addTransporter(){
    const dialogRef = this.dialog.open(TransporterComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTransporter(result?.trans.id);
    });
  }

  filteredTransporter: Transporter[] = [];
  filterTransport(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredTransporter = this.transporter.filter((option) => {
      if (
        (option.name &&
          option.name.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  ivNum: string = "";
  nextId!: any;
  prefix!: string;
  transInvSub!: Subscription;
  transPrefix!: string;
  generateTransInvoiceNumber() {
    this.transInvSub = this.purchaseService.getPurchaseTransporter().subscribe((res) => {
      let purchases = res;
      console.log(purchases);

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.invoiceNo.replace(/\D/g, ''), 10);
          console.log(idNumber);
          console.log(prevMax);



          this.transPrefix = this.extractLetters(inv.invoiceNo);
          console.log(this.transPrefix);


          // Check if the extracted numeric part is a valid number
          if (!isNaN(idNumber)) {
            return idNumber > prevMax ? idNumber : prevMax;
          } else {
            // If the extracted part is not a valid number, return the previous max
            return prevMax;
          }
        }, 0);
        // Increment the maxId by 1 to get the next ID
          console.log(maxId);

          let nextId = maxId + 1;
          const paddedId = `${this.transPrefix}${nextId.toString().padStart(3, "0")}`;

          this.ivNum = paddedId;

          this.purchaseTransportForm.get('invoiceNo')?.setValue(this.ivNum);
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        let nextId = 0o1;
        let prefix = "INV-TS-";
        const paddedId = `${prefix}${nextId.toString().padStart(3, "0")}`;

        this.ivNum = paddedId;

        this.purchaseTransportForm.get('invoiceNo')?.setValue(this.ivNum);
      }
    });
  }

  extractLetters(input: string): string {
    // return input.replace(/[^a-zA-Z]/g, "");
    var extractedChars = input.match(/[A-Za-z-]/g);

    // Combine the matched characters into a string
    var result = extractedChars ? extractedChars.join('') : '';

    return result;
  }

  transSub!: Subscription;
  transStatus: boolean = false
  generateTransSlip(type: string){
    if(!this.purchaseTransportForm.valid){
      return alert("Please enter details completely");
    }
    this.transStatus = true;
    let data = {
      ...this.purchaseTransportForm.value
    }
    data.entryId = this.route.snapshot.params['id'];
    data.date = moment(this.purchaseTransportForm.getRawValue().date).format('YYYY-MM-DD');
    if(this.purchaseTransportForm.getRawValue().chequeClearenceDate != ''){
      data.chequeClearenceDate = moment(this.purchaseTransportForm.getRawValue()?.chequeClearenceDate).format('YYYY-MM-DD');
    }
    console.log(data);

    this.transSub = this.purchaseService.addPurchaseTransporter(data).subscribe(res=>{
      console.log(res);
      let op: any = res
      this._snackBar.open("Transporter Slip added successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/printtransportslip/'+op.id)
      }else if(type === "close"){
        history.back();
      }
    })
  }
}
