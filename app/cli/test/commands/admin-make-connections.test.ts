import {expect, test} from '@oclif/test'

describe('admin-make-connections', () => {
  test
  .stdout()
  .command(['admin-make-connections'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['admin-make-connections', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
