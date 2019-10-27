import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup, FormControl, Validators, Form } from '@angular/forms'
import { ScartService } from '../services/scart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartSvc: ScartService) { }

  editForm: FormGroup;
  userInputItem: string = '';
  itemArray: string[] = [];

  ngOnInit() {
  // For reactive form
  this.editForm = new FormGroup({
    'name': new FormControl(null, Validators.required),
    'content': new FormArray([])
    // 'hobbies': new FormArray([])
  });
  }

  formReset() {
    this.editForm.reset();
  }

  updateItemArray() {
    this.itemArray = this.editForm.get('content').value;
  }

  onAddItem() {
    (<FormArray>this.editForm.get('content')).push(new FormControl(this.userInputItem, [Validators.required]));
    this.updateItemArray();
  }

  itemValueBinder(event) {
    this.userInputItem = event.target.value;
  }

  get itemsArr() {
    return (<FormArray>this.editForm.get('content'));
  }

  deleteItem(index: number) {
    this.itemsArr.removeAt(index);
    this.updateItemArray();
  }

  // For hobbies
  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.editForm.get('hobbies')).push(control);
  }

  // For hobbies
  get controls() {
    return (this.editForm.get('hobbies') as FormArray).controls;
  }

  onSubmit() {
    const data = this.editForm.value;
    // console.log('This is the info submitted: ', data);
    this.cartSvc.sendCart(data);
    // Reset item list and form after submission
    this.formReset();
    // FormArrays don't get reset using formReset, 
    // so this is to manually replace the FormArray with a new one
    // to prevent multiple null from staying in the array
    // e.g. [null, null, newvalue1]
    this.editForm.setControl('content', new FormArray([]));
    this.updateItemArray();
  }

  onLoad() {
    this.cartSvc.getCart(this.editForm.get('name').value)
    .then((data) => {
      // Replaces the current array of items with the items from the loaded user
      this.itemArray = data.content;
      // Resets the form
      this.formReset();
      this.editForm.setControl('content', new FormArray([]));
      // Re-populate the form
      this.editForm.patchValue({
        'name': data.name
      });
      data.content.forEach((item: string) => {
        (<FormArray>this.editForm.get('content')).push(new FormControl(item, [Validators.required]));
      })
    })
    .catch((err) => console.log(err));
  }

}
