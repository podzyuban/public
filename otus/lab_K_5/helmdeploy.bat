helm install kafka bitnami/kafka -f ./kafka/kafka-config.yaml --set rbac.create=true
helm install authservice .\pointservice-chart\
helm install orderservice .\pointservice-orderservice\
helm install kc .\kafka-connect
helm install billingservice .\pointservice-billingservice\
helm install notificationsservice .\pointservice-notificationservice\
helm install api-gateway .\pointservice-apigateway\


