pub mod constants;
pub mod instructions;
pub mod state;
pub mod errors;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("grphAFGNvCjLKHeEmPNa91eGJChcUhrdaYYharcZCTQ");

#[program]
pub mod graph_program {
    use super::*;

    pub fn make_connection(ctx: Context<MakeConnection>, to: Pubkey) -> Result<()> {
        instructions::make_connection(ctx, to)
    }

    pub fn revoke_connection(ctx: Context<RevokeConnection>, _bump: u8, _to: Pubkey) -> Result<()> {
        instructions::revoke_connection(ctx)
    }

    pub fn close_connection(ctx: Context<CloseConnection>, _bump: u8, _to: Pubkey) -> Result<()> {
        instructions::close_connection(ctx)
    }
}
