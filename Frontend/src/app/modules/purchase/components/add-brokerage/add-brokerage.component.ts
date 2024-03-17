import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PurchaseService } from '../../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Broker } from '../../models/broker';
import { BrokerComponent } from '../broker/broker.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-brokerage',
  templateUrl: './add-brokerage.component.html',
  styleUrls: ['./add-brokerage.component.scss']
})
export class AddBrokerageComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private purchaseService: PurchaseService, private _snackBar: MatSnackBar, private dialog: MatDialog,
    private router: Router, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.brokerInvSub?.unsubscribe();
    this.brokAccSub?.unsubscribe();
    this.brokerByIdSub?.unsubscribe();
    this.brokerSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getBroker();
    this.generateBrokerInvoiceNumber();
  }

  brokerageForm = this.fb.group({
    brockerId : [0, Validators.required],
    entryId : [0],
    date : ['', Validators.required],
    bagNo : [0, Validators.required],
    amount : [0, Validators.required],
    invoiceNo :['', Validators.required]
  });

  patchBroker(data: any){
    this.brokerageForm.get('date')?.setValue(data.updatedDate);
  }

  brokerInvSub!: Subscription;
  brokerPrefix!: string;
  ivNum: string = "";
  generateBrokerInvoiceNumber() {
    this.brokerInvSub = this.purchaseService.getBrokerAccount().subscribe((res) => {
      let purchases = res;
      console.log(purchases);

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.invoiceNo.replace(/\D/g, ''), 10);
          console.log(idNumber);

          this.brokerPrefix = this.extractLetters(inv.invoiceNo);
          console.log(this.brokerPrefix);
          console.log(prevMax);


          // Check if the extracted numeric part is a valid number
          if (!isNaN(idNumber)) {
            return idNumber > prevMax ? idNumber : prevMax;
          } else {
            // If the extracted part is not a valid number, return the previous max
            return prevMax;
          }
        }, 0);
        // Increment the maxId by 1 to get the next ID

          let nextId = maxId + 1;
          const paddedId = `${this.brokerPrefix}${nextId.toString().padStart(3, "0")}`;

          this.ivNum = paddedId;

          this.brokerageForm.get('invoiceNo')?.setValue(this.ivNum);
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        let nextId = 0o1;
        let prefix = "INV-BS-";
        const paddedId = `${prefix}${nextId.toString().padStart(3, "0")}`;

        this.ivNum = paddedId;

        this.brokerageForm.get('invoiceNo')?.setValue(this.ivNum);
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


  broker: Broker[] = [];
  brokerSub!: Subscription;
  getBroker(value?: number){
    this.brokerSub = this.purchaseService.getBroker().subscribe(res=>{
      this.broker = res;
      this.filteredBroker = res;
      if(value){
        this.brokerageForm.get('brockerId')?.setValue(value)
      }
    })
  }

  addBroker(){
    const dialogRef = this.dialog.open(BrokerComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getBroker(result?.broker.id);
    });
  }

  filteredBroker: Broker[] = [];
  filterBroker(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredBroker = this.broker.filter((option) => {
      if (
        (option.brokerName &&
          option.brokerName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  brokerRate!: number;
  brokerByIdSub!: Subscription;
  getAmount(id: number){
    if(id){
      this.brokerByIdSub = this.purchaseService.getBrokerById(id).subscribe(res=>{
        console.log(res);
        this.brokerRate = res.rate;
        console.log(this.brokerRate);

      })
    }
  }

  onInputChange(event: any){
    const inputValue: number = event.target.value;
    let amount = this.brokerRate * inputValue
    console.log(amount);

    this.brokerageForm.get('amount')?.setValue(amount);
  }

  brokAccSub!: Subscription;
  brokerStatus: boolean = false
  generateBrokerSlip(type: string){
    if(!this.brokerageForm.valid){
      return alert("Please enter details completely");
    }
    this.brokerStatus = true;
    console.log(this.brokerageForm.value);

    let data = {
      ...this.brokerageForm.value
    }
    data.entryId = this.route.snapshot.params['id'];
    this.brokAccSub = this.purchaseService.addBrokerAccount(data).subscribe(res=>{
      console.log(res);
      let op: any = res
      this._snackBar.open("Broker Slip added successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/printtransportslip/'+op.id)
      }else if(type === "close"){
        history.back();
      }
    })
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


}
