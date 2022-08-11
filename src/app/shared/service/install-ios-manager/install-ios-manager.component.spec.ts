import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallIosManagerComponent } from './install-ios-manager.component';

describe('InstallIosManagerComponent', () => {
  let component: InstallIosManagerComponent;
  let fixture: ComponentFixture<InstallIosManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallIosManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallIosManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
