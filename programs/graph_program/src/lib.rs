pub mod constants;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef");

#[program]
pub mod graph_program {
    use super::*;
    pub fn make_connection(ctx: Context<MakeConnection>, to: Pubkey) -> Result<()> {
        make_connection_instruction(ctx, to)
    }
    pub fn revoke_connection(ctx: Context<RevokeConnection>, _bump: u8, _to: Pubkey) -> Result<()> {
        revoke_connection_instruction(ctx)
    }
}
