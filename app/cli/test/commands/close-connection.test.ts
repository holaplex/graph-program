import {expect, test} from '@oclif/test'

describe('close-connection', () => {
  test
  .stdout()
  .command(['close-connection'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['close-connection', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
