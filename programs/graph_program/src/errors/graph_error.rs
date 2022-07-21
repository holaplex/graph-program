use anchor_lang::prelude::*;

#[error_code]
pub enum GraphError {
    #[msg("Account needs to be disconnected first")]
    AccountNeedsToBeDisconnected,
    #[msg("Disconnection date must be higher than connection date")]
    DisconnectionDateMustBeHigherThanConnectionDate,
    #[msg("Clock date must be higher than connection date. Retry in another block.")]
    ClockDateMustBeHigherThanConnectionDate,
}