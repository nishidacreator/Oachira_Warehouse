import { Component, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/modules/products/product.service';
import { PurchaseService } from '../../purchase.service';
import { Distributor } from 'src/app/modules/products/models/distributor';
import { DistributorComponent } from 'src/app/modules/products/components/distributor/distributor.component';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Slip } from '../../models/slip';
import { ProductComponent } from 'src/app/modules/products/components/product/product.component';
import { Product } from 'src/app/modules/products/models/product';
import { UnitComponent } from 'src/app/modules/products/components/unit/unit.component';
import { SecondaryUnit } from 'src/app/modules/products/models/secondary-unit';
import { GstComponent } from 'src/app/modules/products/components/gst/gst.component';
import { Gst } from 'src/app/modules/products/models/gst';
import { Transporter } from '../../models/transporter';
import { TransporterComponent } from '../transporter/transporter.component';
import { Broker } from '../../models/broker';
import { BrokerComponent } from '../broker/broker.component';
import { LoadingTeam } from '../../models/loading-team';
import { LoadingTeamComponent } from '../loading-team/loading-team.component';
import * as moment from 'moment';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit, OnDestroy {
  @ViewChild(MatStepper) stepper!: MatStepper;

  id!: number;
  isChecked: boolean = false;
  constructor(private fb: FormBuilder, public purchaseService: PurchaseService, public dialog: MatDialog, private productService: ProductService,
    private _snackBar: MatSnackBar, private router: Router, @Optional() public dialogRef: MatDialogRef<EntryComponent>,
    private productservice: ProductService,@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any, private route: ActivatedRoute) {
    //User
    const token: any = localStorage.getItem("token");
    let user = JSON.parse(token);
    this.id = user.id;
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

  ngOnDestroy() {
    this.distributorSub?.unsubscribe();
    this.submitSub?.unsubscribe();
    this.slipSub?.unsubscribe();
    this.productSub?.unsubscribe();
    this.unitSub?.unsubscribe();
    this.gstSub?.unsubscribe();
    this.transportSub?.unsubscribe();
    this.transSub?.unsubscribe();
    this.transInvSub?.unsubscribe();
    this.slipInvSub?.unsubscribe();
    this.loadSub?.unsubscribe();
    this.peByIdSub?.unsubscribe();
    this.statusUpdateSub?.unsubscribe();
    this.brokerInvSub?.unsubscribe();
    this.brokerSub?.unsubscribe();
    this.brokerByIdSub?.unsubscribe();
    this.brokerAccountSub?.unsubscribe();
    this.LTeamInvSub?.unsubscribe();
    this.unloadingSub?.unsubscribe();
    this.unloadByIdSub?.unsubscribe();
    this.slipById?.unsubscribe();
    this.ptSub?.unsubscribe();
    this.plSub?.unsubscribe();
    this.brokSub?.unsubscribe();
    this.peSub?.unsubscribe();
    this.peDetailsSub?.unsubscribe();
  }

  entryStatus: boolean = true;
  isInvoiceNoDisabled: boolean = true;
  addStatus: boolean = false;
  editStatus: boolean = false;
  ngOnInit(): void {
    this.getDistributor()
    // this.generateTransInvoiceNumber()
    let entryId = this.route.snapshot.params['id'];
    if(entryId){
      this.patchData(entryId);
      this.editStatus = true;
    }

    if (this.dialogRef) {
      this.addStatus = true;
      if(this.dialogData.status === 'update'){
        this.patchData(this.dialogData.id)
      }else if(this.dialogData.status === 'true'){
        if(this.dialogData.type === "slipedit"){
          this.selectedIndex = 1;
          this.getSlipAndPatch(this.dialogData.id)
        }
        else if(this.dialogData.type === "transslipedit"){
          this.selectedIndex = 2;
          this.getTransAndPatch(this.dialogData.id)
        }

        else if(this.dialogData.type === "brokerslipedit"){
          this.selectedIndex = 3;
          this.getBrokerAndPatch(this.dialogData.id)
        }
        else if(this.dialogData.type === "unloadslipedit"){
          this.selectedIndex = 4;
          this.getUnloadingAndPatch(this.dialogData.id)
        }
      }
    }
  }

  peByIdSub!: Subscription;
  patchData(id: number){
    this.purchaseService.getPeById(id).subscribe(data =>{
      console.log(data);
      let distributorId = data.distributorId;
      let amount: number = data.purchaseAmount;
      let status = 'ChequeIssued';
      let date: any = data.updatedDate;
      let advanceAmount: number = data.advanceAmount;
      let balAmount = amount - advanceAmount;
      this.purchaseEntryForm.patchValue({
        distributorId: distributorId,
        purchaseAmount: amount,
        status: status,
        // date: date,
        amount: balAmount
      })
    });
  }

  statusUpdateSub!: Subscription;
  updateStatus(){
    let data = {
      chequeNo: this.purchaseEntryForm.get('chequeNo')?.value,
      status: this.purchaseEntryForm.get('status')?.value,
      purchaseInvoiceNo: this.purchaseEntryForm.get('purchaseInvoiceNo')?.value,
      chequeClearenceDate: this.purchaseEntryForm.get('chequeClearenceDate')?.value,
      amount: this.purchaseEntryForm.get('amount')?.value,
      invoiceDate: this.purchaseEntryForm.get('invoiceDate')?.value
    }
    this.statusUpdateSub = this.purchaseService.updatePEStatus(this.dialogData.id, data).subscribe(data =>{
      this._snackBar.open("Entry status update successfully...","" ,{duration:3000})
      this.dialogRef?.close()
    });
  }


  purchaseEntryForm = this.fb.group({
    distributorId: [0, Validators.required],
    purchaseAmount: [0, Validators.required],
    status: ['', Validators.required],
    chequeNo: [''],
    userId: [0],
    advanceAmount: [0],
    purchaseInvoiceNo:[''],
    chequeClearenceDate: [''],
    amount: [0],
    invoiceDate: [],
    purchaseDate: []
  });

  distributorSub!: Subscription;
  distributors: Distributor[] = [];
  getDistributor(value?: number){
    this.distributorSub = this.productService.getDistributor().subscribe(distributor =>{
      this.distributors = distributor
      this.filteredDistributor = distributor;
      if(value){
        this.purchaseEntryForm.get('distributorId')?.setValue(value)
      }
    });
  }

  getDisributorDetails(id: number){
    this.productService.getDistributor
  }

  filteredDistributor: Distributor[] = [];
  filterDistributor(event: any){
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredDistributor = this.distributors.filter((option) => {
      if (
        (option.distributorName &&
          option.distributorName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addDistributor(){
    const dialogRef = this.dialog.open(DistributorComponent, {
      data: { status: "true", type: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDistributor(result?.distributor.id);
    });
  }

  submitSub!: Subscription;
  selectedIndex = 0;
  onSubmit(type: string){
    if(this.purchaseEntryForm.valid){
      this.entryStatus = true;
      let data = {
        ...this.purchaseEntryForm.value
      }
      data.userId = this.id
      console.log(data);

      this.submitSub = this.purchaseService.addPE(data).subscribe(data=>{
        console.log(data);
        let pe: any = data;
        this.peId = pe.id;
        this._snackBar.open("Entry added successfully...","" ,{duration:3000})
        if(type === "close"){
          history.back();
        }else if(type === "slip"){
          this.stepper.next();
          this.patchSlip(data)
        }else if(type === "next"){
          this.stepper.selectedIndex = 2;
          this.generateTransInvoiceNumber();
          this.getTransporter();
          this.patchTrans(data);
        }
      });
    }
  }
  // -------------------------------------------------------------------------------------------------------

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

  patchTrans(data: any){
    this.purchaseTransportForm.get('date')?.setValue(data.updatedDate);
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
    data.entryId = this.peId
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
      }else if(type === "next"){
        this.selectedIndex = 3;
        this.generateBrokerInvoiceNumber()
        this.getBroker()
        this.patchBroker(res)
      }else if(type === "close"){
        history.back();
      }
    })
  }

  transId!: number;
  getTransAndPatch(id: number){
    this.purchaseService.getPurchaseTransporterById(id).subscribe(data =>{
      this.getTransporter();

      this.transId = data.id;
      let chequeNo = data.chequeNo;
      let transporterId:any = data.transporterId;
      let invoiceNo = data.invoiceNo;
      let amount:any = data.amount;
      let date: any = data.date;
      let vehicleNo = data.vehicleNo;
      let from = data.from;
      let noOfBags:any = data.noOfBags;
      let advance: any = data.advance;
      let entryId: any = data.entryId;
      this.generateTransInvoiceNumber()

      this.purchaseTransportForm.patchValue({
        chequeNo: chequeNo,
        transporterId : transporterId,
        invoiceNo: invoiceNo,
        amount : amount,
        date: date,
        vehicleNo: vehicleNo,
        from: from,
        noOfBags: noOfBags,
        advance: advance,
        entryId: entryId
      })
    })
  }

  updateTrans(){
    if(!this.purchaseTransportForm.valid){
      return alert("Please fill form completely");
    }

    this.slipSub = this.purchaseService.updatePurchaseTransporter(this.transId, this.purchaseTransportForm.getRawValue()).subscribe(res=>{
      console.log(res);
      this.dialogRef?.close();
      this._snackBar.open("Purchase Transporter updated successfully...","" ,{duration:3000})
    })
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
    data.entryId = this.peId
    this.brokAccSub = this.purchaseService.addBrokerAccount(data).subscribe(res=>{
      console.log(res);
      let op: any = res
      this._snackBar.open("Broker Slip added successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/printtransportslip/'+op.id)
      }else if(type === "next"){
        this.selectedIndex = 4
        this.generateLTeamInvoiceNumber()
        this.getLoadingTeam();
        this.patchLoad(res)
      }else if(type === "close"){
        history.back();
      }
    })
  }

  brokerId!: number;
  brokerAccountSub!: Subscription;
  getBrokerAndPatch(id: number){
    this.brokerAccountSub = this.purchaseService.getBrokerAccountById(id).subscribe(data =>{
      console.log(data);
      this.getBroker()

      this.brokerId = data.id;
      let brId:any = data.brockerId.toString();
      let invoiceNo = data.invoiceNo;
      let amount:any = data.amount;
      let date: any = data.date;
      let bagNo = data.bagNo;
      let entryId: any = data.entryId;
      // this.generateBrokerInvoiceNumber()

      this.brokerageForm.patchValue({
        brockerId : brId,
        invoiceNo: invoiceNo,
        amount : amount,
        date: date,
        bagNo: bagNo,
        entryId: entryId
      })
    })
  }

  updateBroker(){
    if(!this.brokerageForm.valid){
      return alert("Please fill form completely");
    }

    this.slipSub = this.purchaseService.updateBrokerAccount(this.brokerId, this.brokerageForm.getRawValue()).subscribe(res=>{
      console.log(res);
      this.dialogRef?.close();
      this._snackBar.open("Brokerage updated successfully...","" ,{duration:3000})
    })
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

  patchLoad(data: any){
    this.unloadingForm.get('date')?.setValue(data.updatedDate);
  }

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
    console.log(this.unloadingForm.value);
    console.log(this.peId)
    let data = {
      ...this.unloadingForm.value
    }
    data.entryId = this.peId
    console.log(data);

    this.unloadingSub = this.purchaseService.addPurchaseUnloading(data).subscribe(res=>{
      console.log(res);
      let op: any = res
      this._snackBar.open("Unloading Slip added successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/printtransportslip/'+op.id)
      }else if(type === "next"){
        this.selectedIndex = 5
        this.getPurchaseTransporter(res);
        this.getPurchaseLoading(res);
        this.getBrockerage(res);
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

  updateUnloading(){
    if(!this.unloadingForm.valid){
      return alert("Please fill form completely");
    }

    this.slipSub = this.purchaseService.updatePurchaseUnloading(this.unLoadId, this.unloadingForm.getRawValue()).subscribe(res=>{
      console.log(res);
      this.dialogRef?.close();
      this._snackBar.open("Purchase Unloading updated successfully...","" ,{duration:3000})
    })
  }

  slipForm = this.fb.group({
    purchaseInvoice: ['', Validators.required],
    distributorId: [0],
    invoiceNo:['', Validators.required],
    amount: [''],
    entryId: [0],
    description: [''],
    contactPerson: ['']
  });

  peId!: number;
  patchSlip(data:any){
    this.peId = data.id;
    let distributorId = data.distributorId;
    let purchaseInvoice = data.purchaseInvoiceNo;
    let amount = data.purchaseAmount;
    this.generateInvoiceNumber()
    this.slipForm.patchValue({
      distributorId: distributorId,
      purchaseInvoice: purchaseInvoice,
      amount: amount
    })
  }

  slipId!: number;
  slipById!: Subscription;
  getSlipAndPatch(id: number){
    this.slipById = this.purchaseService.getSlipById(id).subscribe(data =>{
      console.log(data);

      this.slipId = data.id;
      let distributorId = data.distributorId;
      let purchaseInvoice = data.purchaseInvoice;
      let amount:any = data.amount;
      let contactPerson = data.contactPerson;
      let description = data.description;
      this.generateInvoiceNumber()
      this.slipForm.patchValue({
        distributorId: distributorId,
        purchaseInvoice: purchaseInvoice,
        amount: amount,
        contactPerson: contactPerson,
        description: description
      })
    })
  }

  updateSlip(){
    if(!this.slipForm.valid){
      return alert("Please fill form completely");
    }

    this.slipSub = this.purchaseService.updateSlip(this.slipId, this.slipForm.getRawValue()).subscribe(res=>{
      console.log(res);
      this.dialogRef?.close();
      this._snackBar.open("Slip updated successfully...","" ,{duration:3000})
    })
  }

  slipInvSub!: Subscription;
  generateInvoiceNumber() {
    this.slipInvSub = this.purchaseService.getSlip().subscribe((res) => {
      let purchases = res;

      // Check if there are any employees in the array
      if (purchases.length > 0) {
        const maxId = purchases.reduce((prevMax, inv) => {
          console.log(inv);
          // Extract the numeric part of the employee ID and convert it to a number
          const idNumber = parseInt(inv.invoiceNo.replace(/\D/g, ''), 10);
          console.log(idNumber);

          this.prefix = this.extractLetters(inv.invoiceNo);

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
        const paddedId = `${this.prefix}${nextId.toString().padStart(3, "0")}`;

        let ivNum = paddedId;

        this.slipForm.get('invoiceNo')?.setValue(ivNum);
      } else {
        // If there are no employees in the array, set the employeeId to 'EMP001'
        this.nextId = 0o1;
        this.prefix = "INV-PRS-";

        const paddedId = `${this.prefix}${this.nextId.toString().padStart(3, "0")}`;

        let ivNum = paddedId;

        this.slipForm.get('invoiceNo')?.setValue(ivNum);
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

  slipSub!: Subscription;
  slipStatus: boolean = false
  generateSlip(type: string){
    if(!this.slipForm.valid){
      return alert("Please enter details completely");
    }
    this.slipStatus = true;
    let data = {
      ...this.slipForm.value
    }
    data.entryId = this.peId
    this.slipSub = this.purchaseService.addSlip(data).subscribe(res=>{
      console.log(res);
      let op: any = res
      this._snackBar.open("Slip created successfully...","" ,{duration:3000})
      if(type === "print"){
        this.router.navigateByUrl('/login/purachases/printslip/'+op.id)
      }else if(type === "next"){
        this.stepper.next();
      }
    })
  }

  finalForm = this.fb.group({
    eWayBillNo: [''],
    trans:[false],
    transportation: [0],
    unload: [false],
    unloading:[0],
    com: [false],
    commission:[0],
    paymentMode:[''],
    remarks:['']
  });

  ptSub!: Subscription;
  getPurchaseTransporter(data: any){
    this.purchaseService.getPurchaseTransporterByEntryId(data.entryId).subscribe(res=>{
      console.log(res);
      if(res){
        let transportFee= res.amount;
        this.finalForm.get('trans')?.setValue(true);
        this.finalForm.get('transportation')?.setValue(transportFee);
      }
    });
  }

  plSub!: Subscription;
  getPurchaseLoading(data: any){
    this.plSub = this.purchaseService.getPurchaseUnloadingByEntryId(data.entryId).subscribe(res=>{
      console.log(res);

      if(res){
        let unLoadFee = res.amount;
        console.log(unLoadFee);

        this.finalForm.get('unload')?.setValue(true);
        this.finalForm.get('unloading')?.setValue(unLoadFee);
      }
    });
  }

  brokSub!: Subscription;
  getBrockerage(data: any){
    this.purchaseService.getBrockerAccountByEntryId(data.entryId).subscribe(res=>{
      if(res){
        let brokerFee= res.amount;
        this.finalForm.get('com')?.setValue(true);
        this.finalForm.get('commission')?.setValue(brokerFee);
      }
    });
  }

  finalStatus: boolean = false;
  peSub!: Subscription;
  updatePE(){
    if(!this.finalForm.valid){
      return alert("Please enter details completely!");
    }
    this.finalStatus = true;
    let data = {
      invoiceDate: this.finalForm.get('invoiceDate')?.value,
      transportation: this.finalForm.get('transportation')?.value,
      unloading: this.finalForm.get('unloading')?.value,
      commission: this.finalForm.get('commission')?.value,
      paymentMode: this.finalForm.get('paymentMode')?.value,
      eWayBillNo: this.finalForm.get('eWayBillNo')?.value,
      remarks : this.finalForm.get('remarks')?.value,
    }
    this.peSub = this.purchaseService.updatePE(this.peId, data).subscribe(data => {
      this._snackBar.open("Entry updated successfully...","" ,{duration:3000})
      this.selectedIndex = 6
      this.getPe(data)
      this.getProduct();
      this.getUnit();
      this.getGST();
    })
  }

  getPe(data: any){
    this.peId = data.id
    this.addProduct();
  }

  modes = [
    {value :"Gpay"},
    {value :"Credit"},
    {value : "Cash"},
    {value : "Cheque"}
  ];

  entryDetailsForm = this.fb.group({
    products: this.fb.array([])
  });

  products() : FormArray {
    return this.entryDetailsForm.get("products") as FormArray
  }

  newProduct(id?:number): FormGroup {
    return this.fb.group({
      entryId: [id],
      productId : [0,Validators.required],
      quantity :  [0,Validators.required],
      secondaryUnitId :  [0,Validators.required],
      mrp: [0,Validators.required],
      rate: [0,Validators.required],
      discount :  [0],
      gstId :  [0],
      grossAmount:  [0,Validators.required],
      netAmount :   [0,Validators.required],
      taxableAmount : [0,Validators.required]
    })
  }

  addProduct(id?: number) {
    this.products().push(this.newProduct(id));
  }

  removeProduct(i:number) {
    this.products().removeAt(i);
  }

  detailsSub!: Subscription;
  peDetailsSub!: Subscription;
  saveDetails(){
    this.peDetailsSub = this.purchaseService.addPEDetails(this.entryDetailsForm.getRawValue()).subscribe(data => {
      this._snackBar.open("Entry Details updated successfully...","" ,{duration:3000})
      history.back();
    })
  }

  product: Product[] = [];
  productSub!: Subscription;
  getProduct(value?: string){
    this.productSub = this.productService.getProduct().subscribe(res=>{
      this.product = res;
      this.filteredProduct = res;
    })
  }

  addProducts(){
    const dialogRef = this.dialog.open(ProductComponent, {
      data: { status: "true"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProduct(result?.route);
    });
  }

  filteredProduct: Product[] = [];
  filterProduct(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredProduct = this.product.filter((option) => {
      if (
        (option.productName &&
          option.productName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  units: SecondaryUnit[] = [];
  unitSub!: Subscription;
  getUnit(value?:string){
    this.unitSub = this.productService.getSecondaryUnit().subscribe(unit=>{
      this.units = unit;
      this.filteredUnit = unit;
      if(value){
        this.filterUnit(value);
      }
    });
  }

  addUnit(){
    const dialogRef = this.dialog.open(UnitComponent, {
      data: { status: "add", type : "add", unit: "secondary" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUnit(result?.unit);
    });
  }

  filteredUnit: SecondaryUnit[] = [];
  filterUnit(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredUnit = this.units.filter((option) => {
      if (
        (option.secondaryUnitName &&
          option.secondaryUnitName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  gstSub!: Subscription;
  gst: Gst[] = [];
  getGST(value?: string){
    this.unitSub = this.productservice.getGst().subscribe(data => {
      this.gst = data;
      this.filteredGst = this.gst;
      if(value){
        this.filterGst(value);
      }
    })
  }

  filteredGst: Gst[] = [];
  filterGst(event: Event | string) {
    let value: string = "";

    if (typeof event === "string") {
      value = event;
    } else if (event instanceof Event) {
      value = (event.target as HTMLInputElement).value;
    }
    this.filteredGst = this.gst.filter((option) => {
      if (
        (option.gstName &&
          option.gstName.toLowerCase().includes(value?.toLowerCase()))
      ) {
        return true;
      } else {
        return null;
      }
    });
  }

  addGst(i : number){
    const dialogRef = this.dialog.open(GstComponent, {
      data: { status: "add"},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getGST()
      console.log((result.gst.id));

      this.products().at(i).get('gstId')?.setValue(result.gst.id);
    });
  }

  clearControls() {
    this.purchaseEntryForm.reset();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


}
