import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebDataAccess } from './web-data-access';

describe('WebDataAccess', () => {
  let component: WebDataAccess;
  let fixture: ComponentFixture<WebDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(WebDataAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
