import { expect } from 'chai'
import { sample } from '../src/sample'

describe('Sample', () => {
    it('outputs the working confirmation message', () => {
        expect(sample()).to.equal("It works!")
    })
})