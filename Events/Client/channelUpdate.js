// --------------------------------- FUNCION INUTILIZADA (guardada para futuros proyectos) ----------------------------------------------


const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "channelUpdate",
  async execute(oldChannel, newChannel, client) {
    const guild = oldChannel.guild;

    if (permissionsChanged(oldChannel, newChannel)) {
      const auditLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelUpdate,
      });

      const auditLogEntry = auditLogs.entries.first();
      if (!auditLogEntry) return;

      const executor = auditLogEntry.executor;

      if (!executor) {
        console.error("No se pudo obtener el executor del log de auditoría.");
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("🔒 Cambio de Permisos en Canal")
        .setColor(0xffa500)
        .addFields(
          { name: "Canal", value: `<#${newChannel.id}>`, inline: true },
          { name: "Cambiado por", value: `<@${executor.id}> | ${executor.tag}`, inline: true },  
          { name: "Rol Modificado", value: getModifiedRole(oldChannel, newChannel) || "No especificado", inline: true },
          { name: "Fecha y Hora", value: new Date().toLocaleString(), inline: true }
        )
        .setAuthor({
          name: "Registro de Acciones",
          iconURL: client.user.displayAvatarURL(),
        })
        .setFooter({ text: `ID del canal: ${newChannel.id}` })
        .setTimestamp();

      const permissionChanges = comparePermissions(
        oldChannel.permissionOverwrites.cache,
        newChannel.permissionOverwrites.cache
      );

      if (permissionChanges.approved.length > 0) {
        embed.addFields({ name: "✅ Permisos Aprobados", value: permissionChanges.approved.join("\n"), inline: true });
      }

      if (permissionChanges.denied.length > 0) {
        embed.addFields({ name: "⛔ Permisos Denegados", value: permissionChanges.denied.join("\n"), inline: true });
      }

      if (permissionChanges.added.length > 0) {
        embed.addFields({ name: "Permisos Agregados", value: permissionChanges.added.join("\n"), inline: true });
      }

      const logChannelID = client.config[guild.id]; 
      const logChannel = guild.channels.cache.get(logChannelID);
      if (logChannel) {
        logChannel.send({ embeds: [embed] }); 
      } else {
        console.error(`No se encontró el canal de logs para el servidor ${guild.id}.`);
      }
    }
  }
};

function permissionsChanged(oldChannel, newChannel) {
  if (!oldChannel || !newChannel) {
    return false;
  }

  const oldPermissions = getPermissionOverwrites(oldChannel);
  const newPermissions = getPermissionOverwrites(newChannel);

  if (!oldPermissions || !newPermissions) {
    return false;
  }

  for (const [id, oldPerm] of oldPermissions.entries()) {
    const newPerm = newPermissions.get(id);
    if (
      !newPerm ||
      !oldPerm ||
      oldPerm.allow.bitfield !== newPerm.allow.bitfield ||
      oldPerm.deny.bitfield !== newPerm.deny.bitfield
    ) {
      return true;
    }
  }

  return false;
}

function getPermissionOverwrites(channel) {
  return channel.permissionOverwrites.cache;
}

function comparePermissions(oldPermissions, newPermissions) {
  const changes = {
    approved: [],
    denied: [],
    added: [],
  };

  oldPermissions.forEach((oldPerm, id) => {
    const newPerm = newPermissions.get(id);
    if (!newPerm) {
      changes.denied.push(`Denegado: ${formatPermissions(oldPerm.deny.bitfield)}`);
    } else {
      const oldAllow = oldPerm.allow ? oldPerm.allow.bitfield : 0n;
      const oldDeny = oldPerm.deny ? oldPerm.deny.bitfield : 0n;
      const newAllow = newPerm.allow ? newPerm.allow.bitfield : 0n;
      const newDeny = newPerm.deny ? newPerm.deny.bitfield : 0n;

      if (oldAllow !== newAllow || oldDeny !== newDeny) {
        const approvedChanges = newAllow & ~oldAllow;
        const deniedChanges = newDeny & ~oldDeny;

        if (approvedChanges !== 0n) {
          changes.approved.push(formatPermissions(approvedChanges));
        }

        if (deniedChanges !== 0n) {
          changes.denied.push(formatPermissions(deniedChanges));
        }
      }
    }
  });

  newPermissions.forEach((newPerm, id) => {
    if (!oldPermissions.has(id)) {
      changes.added.push(formatPermissions(newPerm.allow.bitfield));
    }
  });

  return changes;
}

function getModifiedRole(oldChannel, newChannel) {
  let modifiedRole = null;

  oldChannel.permissionOverwrites.cache.forEach((oldPerm, id) => {
    const newPerm = newChannel.permissionOverwrites.cache.get(id);
    if (newPerm) {
      if (oldPerm.allow.bitfield !== newPerm.allow.bitfield || oldPerm.deny.bitfield !== newPerm.deny.bitfield) {
        const role = oldChannel.guild.roles.cache.get(id);
        if (role) {
          modifiedRole = role.name;
        }
      }
    }
  });

  return modifiedRole;
}

function formatPermissions(permissionValue) {
  const permissions = [];

  const allPermissions = BigInt(PermissionsBitField.All);

  for (const permission in PermissionsBitField.Flags) {
    const flag = BigInt(PermissionsBitField.Flags[permission]);
    if ((permissionValue & flag) !== 0n) {
      permissions.push(permission);
    }
  }

  return permissions.join("\n");
}
