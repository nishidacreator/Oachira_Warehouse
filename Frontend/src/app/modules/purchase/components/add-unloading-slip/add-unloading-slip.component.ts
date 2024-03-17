import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PurchaseService } from '../../purchase.service';
import { Subscription } from 'rxjs';
import { LoadingTeam } from '../../models/loading-team';
import { LoadingTeamComponent } from '../loading-team/loading-team.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-unloading-slip',
  templateUrl: './add-unloading-slip.component.html',
  styleUrls: ['./add-unloading-slip.component.scss']
})
export class AddUnloadingSlipComponent implements OnInit {

  constructor(private fb: FormBuilder, private purchaseService: PurchaseService, private dialog: MatDialog, private _snackBar: MatSnackBar,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.generateLTeamInvoiceNumber();
    this.getLoadingTeam();
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

  unloadingForm = this.fb.group({
    entryId: [0],
    invoiceNo : [''],
    loadingId : [0],
    noOfBags : [0, Validators.required],
    noOfBox: [0, Validators.required],
    amount : [0, Validators.required],
    date: ['']
  });

  loading: LoadingTeam[] = [];
  loadSub!: Subscription;
  getLoadingTeam(id?: number){
    this.loadSub = this.purchaseService.getUnloadingTeam().subscribe(res=>{
      this.loading = res;
      this.filteredLTeam = res
      if(id){
        this.unloadingForm.get('loadingId')?.setValue(id)
      }
    });
  }

  addLTeam(){
    const dialogRef = this.dialog.open(LoadingTeamComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getLoadingTeam(result?.loadingteam.id);
    });
  }

  filteredLTeam: LoadingTeam[] = [];
  filterLTeam(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredLTeam = this.loading.filter((option) => {
      if (
        (option.teamname &&
          option.teamname.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  LTeamInvSub!: Subscription;
  LTeamPrefix!: string;
  ivNum!: string;
  generateLTeamInvoiceNumber() {
    this.LTeamInvSub = this.purchaseService.getPurchaseUnloading().subscribe((res) => {
      let purchases = res;

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.invoiceNo.replace(/\D/g, ''), 10);

          this.LTeamPrefix = this.extractLetters(inv.invoiceNo);

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
          const paddedId = `${this.LTeamPrefix}${nextId.toString().padStart(3, "0")}`;

          this.ivNum = paddedId;

          this.unloadingForm.get('invoiceNo')?.setValue(this.ivNum);
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        let nextId = 0o1;
        let prefix = "INV-UTS-";
        const paddedId = `${prefix}${nextId.toString().padStart(3, "0")}`;

        this.ivNum = paddedId;

        this.unloadingForm.get('invoiceNo')?.setValue(this.ivNum);
      }
    });
  }

  unloadingSub!: Subscription;
  unloadingStatus: boolean = false
  generateUnloadingSlip(type: string){
    if(!this.unloadingForm.valid){
      return alert("Please enter details completely");
    }
    this.unloadingStatus = true;
    let data = {
      ...this.unloadingForm.value
    }
    data.entryId = this.route.snapshot.params['id'];
    console.log(data);

    this.unloadingSub = this.purchaseService.addPurchaseUnloading(data).subscribe(res=>{
      console.log(res);
      let op: any = res
      this._snackBar.open("Unloading Slip added successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/printtransportslip/'+op.id)
      }else if(type === "close"){
        history.back();
      }
    })
  }

  unLoadId!: number;
  unloadByIdSub!: Subscription;
  getUnloadingAndPatch(id: number){
    this.unloadByIdSub = this.purchaseService.getPurchaseUnloadingById(id).subscribe(data =>{
      console.log(data);
      this.getLoadingTeam()
      this.unLoadId = data.id;
      let loadingId:any = data.loadingId;
      let invoiceNo = data.invoiceNo;
      let amount:any = data.amount;
      let date: any = data.date;
      let noOfBags = data.noOfBags;
      let noOfBox = data.noOfBox;
      // this.generateBrokerInvoiceNumber()

      this.unloadingForm.patchValue({
        loadingId : loadingId,
        invoiceNo: invoiceNo,
        amount : amount,
        date: date,
        noOfBags: noOfBags,
        noOfBox: noOfBox
      })
    })
  }


  extractLetters(input: string): string {
    // return input.replace(/[^a-zA-Z]/g, "");
    var extractedChars = input.match(/[A-Za-z-]/g);

    // Combine the matched characters into a string
    var result = extractedChars ? extractedChars.join('') : '';

    return result;
  }

}
