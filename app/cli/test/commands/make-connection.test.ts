import {expect, test} from '@oclif/test'

describe('makeConnection', () => {
  test
  .stdout()
  .command(['makeConnection'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['makeConnection', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
