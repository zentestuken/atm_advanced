Feature: Checkout Alert
  Scenario: Verify default shop page state
    Then the page should have "Typescript React Shopping cart" title
    And the 16 product cards should be shown

  Scenario: Product can be added to cart
    When the product "Skater Black Sweatshirt" is added to cart
    Then the cart should be open
    And the cart should show added product "Skater Black Sweatshirt"
    And the cart product counter should show "1"
    When the user closes the cart
    Then the cart should be closed
    And the cart product counter should show "1"
