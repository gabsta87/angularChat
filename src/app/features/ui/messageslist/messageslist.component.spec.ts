import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageslistComponent } from './messageslist.component';

describe('MessageslistComponent', () => {
  let component: MessageslistComponent;
  let fixture: ComponentFixture<MessageslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
