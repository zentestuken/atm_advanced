Feature: Shopping cart

  Background:
    Given the user is on the "Shop" page

    @productList
    Scenario: Verify default shop page state
      Then the page should have "Typescript React Shopping cart" title
      And the amount of product cards shown should be 16
      And the following product cards should be shown:
        """
        Skater Black Sweatshirt
        Black Batman T-shirt
        Blue T-Shirt
        """

    @productList
    Scenario: Products can be filtered by size with one filter applied
      When the user clicks on "ML" size filter
      Then "ML" size filter should be checked
      And the amount of product cards shown should be 2
      And the following product cards should be shown:
        """
        Basic Cactus White T-shirt
        Black Tule Oversized
        """
      When the user clicks on "ML" size filter
      Then "ML" size filter should be unchecked
      When the user clicks on "XS" size filter
      Then "XS" size filter should be checked
      Then the amount of product cards shown should be 1
      And the following product cards should be shown:
        """
        Black Batman T-shirt
        """

    @cart
    Scenario Outline: Product can be added to cart
      When the product "<productName>" is added to cart
      Then the cart should be open
      And the cart should show added product "<productName>"
      And the cart product counter should show "1"
      When the user closes the cart
      Then the cart should be closed
      And the cart product counter should show "1"

      Examples:
          | productName             |
          | Skater Black Sweatshirt |
          | Black Batman T-shirt    |

    @cart
    Scenario: Subtotal calculated correctly when products added to cart
      When the product "Skater Black Sweatshirt" is added to cart
      Then the cart should be open
      When the product "Black Batman T-shirt" is added to cart
      Then the cart should show added product "Skater Black Sweatshirt"
      And the cart should show added product "Black Batman T-shirt"
      And "Skater Black Sweatshirt" product row should have price "25.90"
      And "Black Batman T-shirt" product row should have price "10.90"
      And the cart should have 2 product rows
      And the cart product counter should show "2"
      And the cart subtotal should be "36.80"

    @cart
    Scenario: A product can be removed from the cart
      When the product "Skater Black Sweatshirt" is added to cart
      And the product "Black Batman T-shirt" is added to cart
      Then the cart should show added product "Skater Black Sweatshirt"
      And the cart should show added product "Black Batman T-shirt"
      And the cart should have 2 product rows
      When the product "Skater Black Sweatshirt" is removed from the cart
      Then the cart should not show added product "Skater Black Sweatshirt"
      But the cart should show added product "Black Batman T-shirt"
      And the cart should have 1 product rows
      And the cart subtotal should be "10.90"

    @cart
    Scenario: Product amount in cart can be updated
      When the product "Blue T-Shirt" is added to cart
      Then the cart should show added product "Blue T-Shirt"
      And "Blue T-Shirt" product row should have quantity "1"
      When the user clicks plus button for "Blue T-Shirt" product row
      Then "Blue T-Shirt" product row should have quantity "2"
      And "Blue T-Shirt" product row should have price "9.00"
      And the cart subtotal should be "18.00"
      When the user clicks plus button for "Blue T-Shirt" product row
      Then "Blue T-Shirt" product row should have quantity "3"
      And "Blue T-Shirt" product row should have price "9.00"
      And the cart subtotal should be "27.00"
      When the user clicks minus button for "Blue T-Shirt" product row
      Then "Blue T-Shirt" product row should have quantity "2"
      And "Blue T-Shirt" product row should have price "9.00"
      And the cart subtotal should be "18.00"

    @cart
    @checkout
    Scenario Outline: Correct checkout alert shown with one product
      When the product "<productName>" is added to cart
      Then the cart should be open
      And the cart should show added product "<productName>"
      When checkout button is clicked with subtotal of "<subtotal>"
      Then checkout alert should be shown with correct message

      Examples:
      | productName             | subtotal |
      | Skater Black Sweatshirt | 25.90    |
      | Black Batman T-shirt    | 10.90    |

    @cart
    @checkout
    Scenario: Correct checkout alert shown with multiple products
      When the product "Marine Blue T-shirt" is added to cart
      And the product "Blue T-Shirt" is added to cart
      And the product "Cropped Stay Groovy off white" is added to cart
      Then the cart should be open
      And the cart should show added product "Marine Blue T-shirt"
      And the cart should show added product "Blue T-Shirt"
      And the cart should show added product "Cropped Stay Groovy off white"
      When checkout button is clicked with subtotal of "68.90"
      Then checkout alert should be shown with correct message
