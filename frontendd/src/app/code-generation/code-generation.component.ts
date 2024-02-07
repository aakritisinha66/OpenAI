import { Component } from '@angular/core';
import { OpenaiService } from '../service/openai.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-code-generation',
  templateUrl: './code-generation.component.html',
  styleUrls: ['./code-generation.component.css']
})
export class CodeGenerationComponent {

  constructor(private openaiService: OpenaiService, private _formBuilder: FormBuilder, private http: HttpClient, private fileService: FileService) { }

  requestName = new FormControl('');
  language = new FormControl('');;
  description = new FormControl('');;
  chatForm = this._formBuilder.group({
    requestName: this.requestName,
    language: this.language,
    description: this.description
  });

  outputText = '';
  fileContent = '';
  fileName = '';
  disableButton = false
  saveFile = false

  ngOnInit() {
    console.log("Code Generation Page!")
  }

  languages = [
    { value: 'java', viewValue: 'Java' },
    { value: 'python', viewValue: 'Python' },
    { value: 'c++', viewValue: 'C++' }
  ];

  prefixInputTitle = "Interactive code geration: ";
  selectedLanguage: any = this.prefixInputTitle;
  // Function to handle language selection
  onLanguageSelected(language: any) {
    console.log("Language : ", language)
    this.selectedLanguage = "Interactive code geration: "
    this.selectedLanguage = this.selectedLanguage + language;
  }

  onSubmit() {
    this.disableButton = true
    // Print all form control values
    // console.log('Form values:', this.chatForm.value);
    console.log("Valid? ", this.chatForm.invalid)
    // Check if the form is valid
    if (this.chatForm.invalid) {
      // Mark all form controls as touched to display error messages
      this.chatForm.markAllAsTouched();
      this.disableButton = false;
      return; // Don't proceed further if form is invalid
    }

    let userInput: any;
    userInput = this.chatForm.get('description')?.value;
    console.log("Prompt from input field!")
    if (this.fileContent) {
      console.log("Prompt is coming from uploaded file!")
      userInput = this.fileContent
    }
    userInput = `Perform below task/tasks in ${this.chatForm.get('language')?.value} language:- \n` + userInput;
    console.log(userInput)
    this.description.setValue(userInput);
    this.openaiService.sendUserInput(userInput).subscribe((response: any) => {
      console.log(response.assistantResponse)
      this.outputText = response.assistantResponse;
      this.disableButton = false;
      this.saveFile = true
    })
  }

  saveOutputFile() {
    this.saveFile = false
    console.log("Saving output file!");
    let userInput: any;
    userInput = this.chatForm.get('description')?.value;
    const fileName: any = this.chatForm.get('requestName')?.value

    // Write response to file
    this.fileService.writeResponseToFile("Input:-\n" + userInput + "\n\n" + "Response:-\n" +this.outputText, fileName);
    this.saveFile = true
  }

  onFileSelected(event: any) {
    console.log("File Event!")
    if (this.chatForm.get('language')?.invalid) {
      // Language field is invalid
      console.log("Language is missing!")
      this.chatForm.get('language')?.markAsTouched();
      return;
    }
    const file: File = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      // console.log("Formdata : ", formData)

      reader.onload = () => {
        this.fileContent = reader.result as string;
        console.log('File Content:', this.fileContent);
        console.log('File Name:', file.name);
        const prompt = `Perform below task/tasks in ${this.chatForm.get('language')?.value} language:- \n` + this.fileContent;
        this.description.setValue(prompt);
      };
      reader.readAsText(file);
    }
  }

  copyContent(textarea: HTMLTextAreaElement): void {
    textarea.select(); // Select the textarea content
    document.execCommand('copy'); // Copy the selected content to clipboard
  }

}
