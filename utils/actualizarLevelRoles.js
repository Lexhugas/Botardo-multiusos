const config = require('../config.json');

/**
 * @param {GuildMember} member - Miembro srv
 * @param {number} nivel - lvl user
 */
async function actualizarLevelRoles(member, nivel) {
  const levelRoles = config.levelRoles;

  // Rolesitos
  const todosLosRoles = Object.values(levelRoles);

  const rolesAAsignar = Object.entries(levelRoles)
    .filter(([lvl]) => nivel >= parseInt(lvl))
    .map(([_, roleId]) => roleId);

  try {
    for (const roleId of rolesAAsignar) {
      if (!member.roles.cache.has(roleId)) {
        await member.roles.add(roleId);
      }
    }

    // Remueve rolsitos
    for (const roleId of todosLosRoles) {
      if (!rolesAAsignar.includes(roleId) && member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
      }
    }

    console.log(`[NIVEL] Roles actualizados para ${member.user.tag} (nivel ${nivel})`);
  } catch (err) {
    console.error(`[NIVEL] Error al actualizar roles de ${member.user.tag}:`, err);
  }
}

module.exports = actualizarLevelRoles;
