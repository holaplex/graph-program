import {expect, test} from '@oclif/test'

describe('query-connections-from', () => {
  test
  .stdout()
  .command(['query-connections-from'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['query-connections-from', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
