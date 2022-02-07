import { state, style, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RandomizerService } from '../randomizer.service';

enum STATE {
  initial = 'initial',
  toRight = 'toRight',
  toDown = 'toDown',
  toLeft = 'toLeft'
};

const DEFAULT_PARAMATER_BOX_WIDTH: number = 351;

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('initial', style({ transform: 'translate(0, 0)' })),
      state('toRight', style({ transform: 'translate({{calculatedWidth}}px, 0)' }), { params: { calculatedWidth: DEFAULT_PARAMATER_BOX_WIDTH } }),
      state('toDown', style({ transform: 'translate({{calculatedWidth}}px, 151px)' }), { params: { calculatedWidth: DEFAULT_PARAMATER_BOX_WIDTH } }),
      state('toLeft', style({ transform: 'translate(0, 151px)' }))
    ])
  ],
  host: { "(click)": "rotate()" }
})
export class BoxComponent implements OnInit {

  public state: string = 'initial';
  public color: string = '';
  public calculatedWidth: number = 351;

  constructor(private randomizerService: RandomizerService, el: ElementRef) {
    this.el = el.nativeElement;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculatedWidth = this.el.offsetWidth - this.sphereWidth;
  }
  
  ngOnInit(): void {
    this.getColor().subscribe((response: any) => {
      this.color = response?.new_color;
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
  private readonly sphereWidth: number = 50;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private el: HTMLElement;

  private getColor(): Observable<any> {
    return this.randomizerService.getRequest();
  }

  private rotate() {
    this.getColor().subscribe((response: any) => {
      // Random color assignment
      this.color = response?.new_color;
      // Switch state
      switch (this.state) {
        case STATE.initial:
          this.state = STATE.toRight;
          break;
        case STATE.toRight:
          this.state = STATE.toDown;
          break;
        case STATE.toDown:
          this.state = STATE.toLeft;
          break;
        case STATE.toLeft:
          this.state = STATE.initial;
          break;
        default:
          this.state = STATE.initial;
          break;
      }
    });
  }
}
