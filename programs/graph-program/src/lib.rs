pub mod constants;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef");

#[program]
pub mod graph_program {
    use super::*;
    pub fn make_connection(ctx: Context<MakeConnection>, to: Pubkey) -> ProgramResult {
        make_connection_instruction(ctx, to)
    }
    pub fn revoke_connection(ctx: Context<RevokeConnection>) -> ProgramResult {
        revoke_connection_instruction(ctx)
    }
}
