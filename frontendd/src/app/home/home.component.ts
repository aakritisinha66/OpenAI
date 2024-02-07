import { Component } from '@angular/core';
import { OpenaiService } from '../service/openai.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private openaiService: OpenaiService, private router: Router){}

  ngOnInit() {
    console.log("Home page!")
  }

  goToCodeGen() {
    console.log("Clicked code gen!")
    this.router.navigateByUrl('/code-generation');
  }

  goToImageGen() {
    console.log("Clicked image gen!")
    this.router.navigateByUrl('/image-generation');
  }
}
