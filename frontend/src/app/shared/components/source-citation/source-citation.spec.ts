import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCitation } from './source-citation';

describe('SourceCitation', () => {
  let component: SourceCitation;
  let fixture: ComponentFixture<SourceCitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceCitation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceCitation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
