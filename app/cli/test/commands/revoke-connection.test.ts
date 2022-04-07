import {expect, test} from '@oclif/test'

describe('revoke-connection', () => {
  test
  .stdout()
  .command(['revoke-connection'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['revoke-connection', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
