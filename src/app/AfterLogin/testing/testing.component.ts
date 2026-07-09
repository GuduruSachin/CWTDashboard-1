import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnChanges, OnInit, DoCheck, AfterViewInit, OnDestroy {

  @Input() name: string = 'Guest';

  @ViewChild('headingRef') heading!: ElementRef;

  private intervalId: any;

  // constructor() {
  //   console.log('Constructor: Component instance created');
  // }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges:', changes);
  }
  num1 : any = 5;
  num2 : any = '5'
  ngOnInit(): void {
    if(this.num1 == this.num2){
      console.log("Success");
    }else{
      console.log("error");
    }
    console.log('ngOnInit: Initialization logic');
    // Simulate polling or a repeating task
    this.intervalId = setInterval(() => {
      console.log('Polling data every 2 seconds...');
    }, 2000);
  }

  ngDoCheck(): void {
    console.log('ngDoCheck: Custom change detection');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: View is initialized');
    this.heading.nativeElement.style.color = 'blue';
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy: Cleanup');
    clearInterval(this.intervalId); // prevent memory leaks
  }

  changeName(): void {
    this.name = this.name === 'Guest' ? 'Umesh' : 'Guest';
    console.log('changeName(): name changed to', this.name);
  }

}
