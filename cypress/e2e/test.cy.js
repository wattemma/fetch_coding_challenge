describe('Coding Challenge', () => {
  it('Finding the fake gold bar', () => {
    cy.visit('http://sdetchallenge.fetch.com/ ');

    // My approach: dividing the the bars into three groups then comparing.
   // Encountering a timeout error during the implementation phase of the coding challenge. The issue arises when attempting to click the reset button, which remains disabled longer than expected due to asynchronous operations not completing in the anticipated time frame.

    //comparing group 1) 012 with group 2) 345
    cy.get('#left_0').type('0');
    cy.get('#left_1').type('1');
    cy.get('#left_2').type('2');
    cy.get('#right_0').type('3');
    cy.get('#right_1').type('4');
    cy.get('#right_2').type('5');
    cy.get('#weigh').click();

    //Checking the result
    cy.get('.game-info ol li').first().then($firstResult => {
      const resultText = $firstResult.text();

      if (resultText.includes('>')) {
        // Group A is heavier group b has the fake
        performSecondWeighing(['0', '1'], ['6', '7']);
      } else if (resultText.includes('<')) {
        // Group B is heavier, group 1 has the fake
        performSecondWeighing(['3', '4'], ['6', '7']);
      } else {
        // group c has the fake
        performSecondWeighing(['6', '7'], ['0', '1']);
      }
    });

    function performSecondWeighing(leftBars, rightBars) {
      cy.get('#reset').click();
      leftBars.forEach((bar, index) => {
        cy.get(`#left_${index}`).type(bar);
      });
      rightBars.forEach((bar, index) => {
        cy.get(`#right_${index}`).type(bar);
      });
      cy.get('#weigh').click();

      // checking the result, moving to next step
      cy.get('.game-info ol li').eq(1).then($secondResult => {
        const secondText = $secondResult.text();
        if (secondText.includes('>') || secondText.includes('<')) {
          // one group is lighter so it has the fake
          const lighterGroup = secondText.includes('>') ? leftBars : rightBars;
          cy.get(`#coin_${lighterGroup[0]}`).click();
        } else {
          // They balance, the untested bar is fake
          const untestedBar = ['6', '7', '8'].find(bar => !leftBars.includes(bar) && !rightBars.includes(bar));
          cy.get(`#coin_${untestedBar}`).click();
        }
      });
    }
  });
});
