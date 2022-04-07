pub mod constants;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use instructions::*;

declare_id!("grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef");

#[program]
pub mod graph_program {
    use super::*;
    pub fn make_connection(ctx: Context<MakeConnectionV2>, to: Pubkey) -> Result<()> {
        make_connection_instruction_v2(ctx, to)
    }
    pub fn revoke_connection(
        ctx: Context<RevokeConnectionV2>,
        _bump: u8,
        _to: Pubkey,
    ) -> Result<()> {
        revoke_connection_instruction_v2(ctx)
    }
    pub fn close_connection(ctx: Context<CloseConnectionV2>, _bump: u8, _to: Pubkey) -> Result<()> {
        close_connection_instruction_v2(ctx)
    }
    pub fn migrate_v1_to_v2_connection(
        ctx: Context<MigrateV1ToV2Connection>,
        _bump: u8,
        _to: Pubkey,
    ) -> Result<()> {
        migrate_v1_to_v2_connection_instruction(ctx)
    }
}
