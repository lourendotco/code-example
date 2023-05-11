describe('bloglist', () => {
  before(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset/user`)
    const user = {
      username: 'John',
      password: 'Doe',
      name: 'John Doe'
    }
    const foreignUser = {
      username: 'Jane',
      password: 'Doe',
      name: 'Jane Doe'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, foreignUser)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
  })
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.visit('')
  })
  it('login form is displayed', () => {
    cy.get('input[name="username"]')
    cy.get('input[name="password"]')
  })
  it('and it works', () => {
    cy.get('input[name="username"]').type('John')
    cy.get('input[name="password"]').type('Doe')
    cy.get('button[name="login"]').click()

    cy.contains('hello John Doe')
  })
  it('fails with wrong credentials', () => {
    cy.get('input[name="username"]').type('John')
    cy.get('input[name="password"]').type('Doee')
    cy.get('button[name="login"]').click()

    cy.contains('invalid username or password')
      .should('have.css', 'background-color', 'rgb(244, 63, 94)')
  })
  describe('when logged in', () => {
    beforeEach(() => {
      cy.login('John', 'Doe')
      cy.visit('')
    })
    it('composer is hidden', () => {
      cy.get('input[name="title"]').should('not.be.visible')
      cy.get('input[name="author"]').should('not.be.visible')
      cy.get('input[name="url"]').should('not.be.visible')
      cy.get('input[name="tags"]').should('not.be.visible')
    })
    it('can add blog and like it', () => {
      cy.contains('compose blog').click()
      cy.get('input[name="title"]').type('Exercises 5.17.-5.23.')
      cy.get('input[name="author"]').type('Matti Luukkainen')
      cy.get('input[name="url"]').type('https://fullstackopen.com/en/part5/end_to_end_testing#exercises-5-17-5-23')
      cy.get('input[name="tags"]').type('testing react e2e-testing{enter}{enter}')

      cy
      .contains('blogs').parent()
      .contains('Exercises 5.17.-5.23. Matti Luukkainen').parent()
      .contains('expand').click()
      cy
      .contains('testing')
      cy
      .contains('e2e-testing')
      cy
      .get('button[name="upvote"]').click()
      .parent().contains('1')
    })
  })
  describe.only('when there are several blogs', () => {
    beforeEach(() => {
      cy.login('John', 'Doe')
      cy.createBlog({ title:'A new Blog', author:'Number 1', url:'http://blogspot.com', tags:'' })
      cy.createBlog({ title:'A newer Blog', author:'Number 2', url:'http://blogger.com', tags:'' })
      cy.login('Jane', 'Doe')
      cy.createBlog({ title:'A stranger\'s Blog', author:'Number 3', url:'http://blogs.sapo.pt', tags:'' })
      cy.login('John', 'Doe')
      cy.visit('')
    })
    it('user can delete their blog', () => {
      cy.contains('A new Blog').parent()
        .contains('expand').click()
        .parent().parent().contains('delete').click()
      cy.contains('A new Blog').should('not.exist')
    })
    it('user cannot delete another\'s blog', () => {
      cy.contains('A stranger\'s Blog').parent()
        .contains('expand').click()
        .parent().parent().contains('delete').should('not.exist')
    })
    it.only('blogs are ordered according to likes', () => {
      cy.get('button[name="upvote"]').eq(2).click()
      cy.get('button[name="downvote"]').eq(0).click()
      cy.login('Jane', 'Doe')
      cy.visit('')
      cy.get('button[name="upvote"]').eq(2).click()
      .parent().contains('2')
      cy.get('button[name="downvote"]').eq(0).click()
      cy.contains('sort by liked').click()

      cy.get('.font-light').eq(0).contains('A stranger\'s Blog')
    })
  })
})