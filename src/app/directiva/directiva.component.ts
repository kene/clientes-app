import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent{

  listCourses: string[] = ['Typescript', 'Javascript', 'Java SE', 'C#', 'PHP']
  enable: boolean = true; 

  constructor() { }

  setEnable(): void{
    this.enable = (this.enable==true)? false: true; 
  }

}
