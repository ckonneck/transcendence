up: tsc
	docker compose up -d

tsc:
	npx tsc --project config/tsconfig.json

down:
	docker compose down --remove-orphans

re: down tsc build up

build:
	docker compose build

status:
	docker ps

logs:
	docker-compose logs --tail=20

exec-fast:
	docker exec -it fastify bash

exec-nginx:
	docker exec -it nginx bash

exec-vault:
	docker exec -it vault sh

clean-vol:
	docker volume prune -f

clean-all:
	docker system prune -a -f

build-no-cache:
	docker compose build --no-cache
	
modsec-logs:
	docker exec nginx cat /var/log/modsec_audit.log

sec-logs-live:
	docker exec -it nginx tail -f /var/log/modsec_audit.log
	
modsec-report:
	@docker exec nginx bash -c "\
	if [ ! -f /var/log/modsec_audit.log ]; then \
	  echo '❌ Audit log not found at /var/log/modsec_audit.log'; \
	  exit 1; \
	fi; \
	echo ''; \
	echo '🧱 Top Triggered Paranoia Levels:'; \
	grep -oE 'tag \"paranoia-level/[0-9]+\"' /var/log/modsec_audit.log | sort | uniq -c | sort -nr || echo '  (none found)'; \
	echo ''; \
	echo '🎯 Top Triggered Rule IDs:'; \
	grep -oE 'id \"[0-9]+\"' /var/log/modsec_audit.log | sort | uniq -c | sort -nr | head -20 || echo '  (none found)'; \
	echo ''; \
	echo '⚠️  Anomaly Scores:'; \
	grep -i 'Inbound Anomaly Score Exceeded' /var/log/modsec_audit.log | \
  	sed -E 's/.*id \"([0-9]+)\".*Total Score: ([0-9]+).*/Rule ID: \1  →  Total Score: \2/' || echo '  (none found)'; \
	echo ''; \
	echo '📋 Summary: Total rule hits:'; \
	grep -oE 'id \"[0-9]+\"' /var/log/modsec_audit.log | wc -l; \
	echo ''; \
	echo '📋 Summary: Distinct requests with rule hits:'; \
	grep -B10 -E 'id \"[0-9]+\"' /var/log/modsec_audit.log | grep -oE '^---[A-Za-z0-9]+---' | sort | uniq | wc -l; \
	echo ''; \
	echo '💡 Tip: Use these rule IDs to look them up in CRS rules folder.'"
vaultcmd:
	docker exec -it vault vault $(filter-out $@,$(MAKECMDGOALS))
%:
	@:
