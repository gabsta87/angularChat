import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryboxComponent } from './entrybox.component';

describe('EntryboxComponent', () => {
  let component: EntryboxComponent;
  let fixture: ComponentFixture<EntryboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
